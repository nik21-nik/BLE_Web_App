/*
 * MOSbot_RGB_BLE.cpp
 *
 * Created: 03.04.2022 20:51:35
 * Author : n-sto
 */ 

//
// port/pin mapping /////////////////////////////////////////////////////////////////////////////
/*
	PA3 - lipo voltage					4.3/2V - ?V					input
	PA4 - distance calc					3.3V - 0V					input

	PB3 - Motor1 PWM					0 - 100 %					output
	PB4 - Motor2 PWM					0 - 100 %					output

	PC3 - lipo charge status			0 charging	1 charged		input
	PC4 - BLE reset						0 reset		1 normal func	output
	PC5 - VCC BLE enable/disable		1 enabled	0 disabled		output
	PC6 - VCC MOTORs enable/disable		1 enabled	0 disabled		output
	PC7 - VCC Reference enable/disable	1 enabled	0 disabled		output

	PD4 - LED blue						1 off		0 on			input
	PD5 - LED green						1 off		0 on			input
	PD6 - LED red						1 off		0 on			input
	PD7 - USER button					1 pressed	0 not pressed	input
*/

//###############################################################################################
// initialization ###############################################################################
//###############################################################################################

// clock frequency //////////////////////////////////////////////////////////////////////////////

#ifndef F_CPU
	#define F_CPU 16000000
#endif

// include-files ////////////////////////////////////////////////////////////////////////////////

#include <avr/io.h>
#include <avr/interrupt.h>		// for global interrupts
#include <stdio.h>
#include <inttypes.h>
#include <stdint.h>				// definition of uint8_t...
#include <stdlib.h>     		// for rand()
#include <util/delay.h>			// for delay
#include <util/twi.h>			// for i2c/twi
#include <compat/ina90.h>		// for NOP
#include <string.h>
#include <stdbool.h>			// for true/false 
#include <avr/sleep.h>			// for sleep mode
#include <avr/eeprom.h>			// for eeprom functions


//###############################################################################################
// global variables /////////////////////////////////////////////////////////////////////////////


// BLE strings
char COMMAND_MODE[4] 				= "$$$";
char END_COMMAND_MODE[4] 			= "END";
char DATA_MODE[4] 					= "---";	// + \r 0x0D
char BLE_READY[5] 					= "CMD>";
char COMMAND_SUCCESS[4] 			= "AOK";
char COMMAND_ERROR[4] 				= "ERR";

// Variables for communication
volatile uint8_t received_int = 0;
volatile bool interrupt_flag = false;

const uint8_t default_value    = 0;
const uint8_t con_successful   = 1;
const uint8_t red_1            = 2;
const uint8_t red_0            = 3;
const uint8_t green_1          = 4;
const uint8_t green_0          = 5;
const uint8_t blue_1           = 6;
const uint8_t blue_0           = 7;

// function prototypes //////////////////////////////////////////////////////////////////////////
void rgb_led_web_app(uint8_t data);
void enable_vcc_motors(bool val);
void enable_vcc_uart(bool val);
void ble_vcc_enable(bool val);
void ble_hardware_reset(bool val);

void uart1_char_send (char data);
void uart1_string_send (char *data);
void uart1_string_send_n (char *data);
void uart1_string_send_rn (char *data);
void uart1_int_send (uint8_t data);




// BLE functions
void ble_enable();
void ble_reset();


// initialize UART communication ////////////////////////////////////////////////////////////////
#define 	USART1_BAUD_RATE 38400							// baud rate BLE
#define 	USART1_BAUD_SELECT 25							//

// UART1
void USART1_Init(void)										// for BLE RN4871 or DEBUG
{													
	UBRR1H = ((unsigned char)(USART1_BAUD_SELECT>>8)); 		// high 8 bit of baud rate in UBRR1H
	UBRR1L = (unsigned char) USART1_BAUD_SELECT;			// low 8 bit of baud rate in UBRR1L
	UCSR1B |= (1<<RXCIE1) | (1<<TXEN1) | (1<<RXEN1);		// enable USART Transmitter and Receiver
															// enable Interrupt on char receive
	UCSR1C = (1<<UCSZ11)|(1<<UCSZ10);						// 8 data 1 stop bit
}


void USART1_disable(void)
{
	UCSR1B = 0x00;
}


//###############################################################################################
// main programm ################################################################################
//###############################################################################################

int main()
{
	_delay_ms(100);							// some boot time for ?C

	// PORTA IO direction
	DDRA = 0x00;							// set ADC port pins to input
											//				 for lipo voltage PA3
											//				 for distance calculation PA4

	// PORTB IO direction
	DDRB = 0x00;							// set to input
											//				 for interrupt PB2
	DDRB |= (1<<DDB3)|(1<<DDB4);			// set to output for MOTORs (PWM)

	// PORTC IO direction
	DDRC = 0x00;							// set to input
											//				 for LIPO charge status PC3
	DDRC |= (1<<DDC4);						// set to output for BLE reset
	DDRC |= (1<<DDC5);						// set to output for VCC BLE enable/disable
	DDRC |= (1<<DDC6);						// set to output for VCC MOTORs enable/disable
	DDRC |= (1<<DDC7);						// set to output for VCC Reference enable/disable
	PORTC = 0x00;							// set low


	// PORTD IO direction
	DDRD = 0x00;							// set to input
											//				 for USER button PD7
	PORTD &= ~( (1<<PD4) | (1<<PD5) | (1<<PD5));// 			 for RGB LED
	
	
	sei();

	USART1_Init();


	//*******************************************************************************************
	// LED test *********************************************************************************

	rgb_led_web_app(red_1);
	_delay_ms(1000);
	rgb_led_web_app(red_0);
	rgb_led_web_app(green_1);
	_delay_ms(1000);
	rgb_led_web_app(green_0);
	rgb_led_web_app(blue_1);
	_delay_ms(1000);
	rgb_led_web_app(blue_0);
	_delay_ms(1000);


	// ******************************************************************************************
	ble_enable();
	while(received_int != con_successful);				// Abwarten bis Verbindung zum BLE-Modul aufgebaut wurde
	DDRD |= (1<<DDD5); 						// HIGH = LED on --> Gruene LED kurz anmachen, ohne dass Feedback gegeben wird!
	_delay_ms(200);
	DDRD &= ~(1<<DDD5);						// LOW = LED off




	while(1)
	{
		if(interrupt_flag){
			rgb_led_web_app(received_int);
			interrupt_flag = false;
			received_int = 0;
		}
		 
		 
		 //if(received_int == 2)
		 //{
		 	//rgb_led(1,0,0);
			//received_int = 0;
		 //}
		 //if(received_int == 3)
		 //{
		 	//rgb_led(0,0,0);
			//received_int = 0;
		 //}
		 //if(received_int == 1 || received_int == 2){
			 //while(1){}
		 //}
		
		//rgb_led(1,0,0);
		//_delay_ms(1000);
		//// rgb_led(0,1,0);
		//// _delay_ms(2000);
		//rgb_led(0,0,0);
		//_delay_ms(3000);

	} // end while(1)

} // end main


//###############################################################################################
// sub programmes ###############################################################################
//###############################################################################################

//###############################################################################################
// functions for UART ###########################################################################

// **********************************************************************************************
// int send (1byte) 
void uart1_int_send (uint8_t data)
{
	while (!(UCSR1A & (1<<UDRE1)))
	{
		// wait until sending is possible
	}
	UDR1 = data;
	//uart1_char_send(0x0D);	// \r
	//uart1_char_send(0x0A);	// \n
}


// debug/ble char send (1byte)
void uart1_char_send (char data)
{
	while (!(UCSR1A & (1<<UDRE1)))
	{
		// wait until sending is possible
	}
	UDR1 = data;
}

// char send (nbyte)
void uart1_string_send (char *data)
{
	int i;
	
	for (i=0;i<strlen(data);i++)
	{
		while (!(UCSR1A & (1<<UDRE1)))
		{
			// wait until sending is possible
		}
		UDR1 = data[i];
	}
}

// char send (nbyte) + line feed
void uart1_string_send_n (char *data)
{
	int i;

	for (i=0;i<strlen(data);i++)
	{
		while (!(UCSR1A & (1<<UDRE1)))
		{
			// wait until sending is possible
		}
		UDR1 = data[i];
	}
	uart1_char_send(0x0A);	// \n

}

// char send (nbyte) + \r\n
void uart1_string_send_rn (char *data)
{
	int i;

	for (i=0;i<strlen(data);i++)
	{
		while (!(UCSR1A & (1<<UDRE1))) {}
		{
			// wait until sending is possible
		}
		UDR1 = data[i];
	}
	uart1_char_send(0x0D);	// \r
	uart1_char_send(0x0A);	// \n
}



//###############################################################################################
// enable/disable functions #####################################################################

void rgb_led_web_app(uint8_t data)
{
	switch (data) {
		case con_successful:						// bei Verbindung den akutellen Status des Registers senden
			if(DDRD & (1<<DDD6)){
				uart1_int_send(red_1);
			}
			_delay_ms(20);
			if(DDRD & (1<<DDD5)){
				uart1_int_send(green_1);
			}
			_delay_ms(20);
			if(DDRD & (1<<DDD4)){
				uart1_int_send(blue_1);
			}
			_delay_ms(20);
			uart1_int_send(con_successful);
		break;
				
		case red_1:
		DDRD |= (1<<DDD6); 							// HIGH = LED on
		uart1_int_send(red_1);
		break;
		
		case red_0:
		DDRD &= ~(1<<DDD6);							// LOW = LED off
		uart1_int_send(red_0);
		break;

		case green_1:
		DDRD |= (1<<DDD5); 							// HIGH = LED on
		uart1_int_send(green_1);
		break;
		
		case green_0:
		DDRD &= ~(1<<DDD5);							// LOW = LED off
		uart1_int_send(green_0);
		break;

		case blue_1:
		DDRD |= (1<<DDD4); 							// HIGH = LED on
		uart1_int_send(blue_1);
		break;
		
		case blue_0:
		DDRD &= ~(1<<DDD4);							// LOW = LED off
		uart1_int_send(blue_0);
		break;

		//weitere Aktoren hier durch neues cases einfach erweitern!

		default:
		break;
	}
	
	
	
	
	// if (red == 1)
	// {
	// 	DDRD |= (1<<DDD6); 							// HIGH = LED on
	// 	uart1_int_send(red_1);
	// }
	// else if (red == 0)
	// {		
	// 	DDRD &= ~(1<<DDD6);							// LOW = LED off
	// 	uart1_int_send(red_0);
	// }
	
	// if (green == 1)
	// {
	// 	DDRD |= (1<<DDD5); 							// HIGH = LED on
	// 	uart1_int_send(green_1);
	// }
	// else if (green)
	// {		
	// 	DDRD &= ~(1<<DDD5);							// LOW = LED off
	// 	uart1_int_send(green_0);
	// }
	
	// if (blue)
	// {
	// 	DDRD |= (1<<DDD4); 							// HIGH = LED on
	// 	uart1_int_send(blue_1);
	// }
	// else
	// {		
	// 	DDRD &= ~(1<<DDD4);							// LOW = LED off
	// 	uart1_int_send(blue_0);
	// }
}


void ble_vcc_enable(bool val)
{
	if (val)
	{
		PORTC |= (1<<PC5); 							// HIGH = VCC BLE on
	}
	else
	{		
		PORTC &= ~(1<<PC5);							// LOW = VCC BLE off
	}
}


void ble_hardware_reset(bool val)
{
	if (val)
	{
		PORTC &= ~(1<<PC4);							// LOW = RESET BLE Module
	}
	else
	{
		PORTC |= (1<<PC4); 							// HIGH = normal function
	}
}


//###############################################################################################
// RN4871 BLE functions #########################################################################

void ble_enable()
{
	ble_hardware_reset(true);
	_delay_ms(5);
	ble_vcc_enable(true);
	_delay_ms(10);
	ble_hardware_reset(false);
}


void ble_reset()
{
	ble_hardware_reset(true);
	_delay_ms(20);
	ble_hardware_reset(false);
}


ISR(USART1_RX_vect){
	/* Wait for data to be received */
	while ( !(UCSR1A & (1<<RXC1)) );			// ist wahrscheinlich nicht noetig, weil Interrupt nur mit dieser Bedinung erfolgt
	
	interrupt_flag = true;

	/* Get and return received data from buffer */
	received_int = UDR1;
}

//###############################################################################################
// End ##########################################################################################
//###############################################################################################
