import logo from './logo.svg';
import './index.css';
import React from 'react';


const ZERO = '0';
const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = 'x';
const DIVIDE = '/';

// REACT CODE

// main code head
class CalculatorGrid extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      upDisplay: '',
      lowDisplay: '0',

      operand: '0',
      lastOperand: '',

      isOperation: false,
      whichOperation: ''
    }
    
    this.pushOperandToLast = this.pushOperandToLast.bind(this);
    this.clearOperand = this.clearOperand.bind(this);
    this.updateLowerDisplay = this.updateLowerDisplay.bind(this);
    this.clickNumber = this.clickNumber.bind(this);
    this.handleConcat = this.handleConcat.bind(this);
    this.clickOperation = this.clickOperation.bind(this);
    this.handleZero = this.handleZero.bind(this);
  }

  // Set state.lastOperand equal to state.operand
  pushOperandToLast(operand) {
    this.setState({lastOperand: operand});
    this.updateUpperDisplay(operand);
  }

  // Clears the operand, just for refactoring purposes
  clearOperand() {
    this.setState({
      operand: '0'
    });
  }

  /* 
  Displays the data that we want. Any calls to this should be handled implicity, and not using 
  state that may be waiting to update.
  For instance, we do not say:
    1   let concatedNumber = this.state.operand.concat(NUMBER);
    2   this.setState({operand: concatedNumber})
    3   this.updateLowerDisplay(this.state.operand);
  The issue with this line is the third line. 
  */

  updateLowerDisplay(value) {
    this.setState( () => {
      return ({lowDisplay: value});
    });
  }

  updateUpperDisplay(value) {
    this.setState( () => {
      return ({upDisplay: value});
    });
  }

  // Adds 'number' to the end of an existing acceptable operand
  handleConcat(NUMBER) {
    let concatedNumber = this.state.operand.concat(NUMBER);
    this.setState(()=> {
      return {operand: concatedNumber}
    })
    this.updateLowerDisplay(concatedNumber);
  }

  /*
    Checking to see if this.state.operand is only a '0', if it is then
    nothing happens. If this.state.operand has other values it is safe
    to append zeros
  */
  handleZero() {
    if (this.state.operand!=ZERO) {
      let concatedZero = this.state.operand.concat(ZERO);
      this.setState( () => {
        return {
          operand: concatedZero
        }
      });
      this.updateLowerDisplay(concatedZero);
    }
  }

  // Function is called when a number is clicked
  clickNumber(event) {

    // 'number' is set to the number clicked
    let NUMBER = event.target.innerText

    /* 
      If the number 0 is clicked, we don't want 0 to simply be concating onto the existing operand
      lest we create a situation where we have '003080', so we separate zero and check whether it
      should be appended
    */

    if(NUMBER==ZERO) {
      this.handleZero()
    }

    /*
      If the value of the operand is default '0' then 'number' is not concated to it, but replaces
      the default value. This prevents readouts like '03' (if 3 is clicked.) Instead it will become '3'
    */
    else {
      if(this.state.operand==ZERO) {
        this.setState({operand: NUMBER});
        this.updateLowerDisplay(NUMBER);
      }
      else if(this.state.operand!=ZERO) {
        this.handleConcat(NUMBER);
      }
    }
  }


  setOperation(OPERATION) {
    this.setState({
      whichOperation: OPERATION
    });
    this.updateLowerDisplay(OPERATION);
  }


  /* 
  Changes what operation is supposed to be performed.
  -if there is no operand, it does nothing
  -if there is only an operand, it sends the operand to lastOperand
   and clears operand
  -if there is both an operand and a lastOperand, it performs the 
   operand last saved to the lastOperand and operand
   (formula: lastOperand (whichOperation) operand)
  */
  clickOperation(event) {
    const OPERATION = event.target.innerText;

    // If there's no operand, AND there's no lastOperand, there's no point in setting an operation.
    if (this.state.operand=='0' && this.state.lastOperand=='') {
      return;
    }

    // This condition is for if we have a lastOperand in state, but want to switch the operation.
    // it will execute before the next operation preventing an error where the code performs operations
    // with the preset '0' value
    // This also subtly handles cases where users may try to offend with zero. 
    else if (this.state.operand=='0') {
      this.setOperation(OPERATION);
    }

    // if we have both an operand and a lastOperand, AND the user clicks a new operation, we want to perform
    // the previous operation before moving on. This is what this chunk is for.
    else if (this.state.operand && this.state.lastOperand) {

      const LEFTSIDE = parseInt(this.state.lastOperand);
      const RIGHTSIDE = parseInt(this.state.operand);


      switch(this.state.whichOperation) {
        case ADD:
          this.pushOperandToLast(LEFTSIDE + RIGHTSIDE);
          console.log(LEFTSIDE + " " + this.state.whichOperation + " " + RIGHTSIDE + " = " + (LEFTSIDE + RIGHTSIDE));
          break;
        case SUBTRACT:
          this.pushOperandToLast(LEFTSIDE - RIGHTSIDE);
          console.log(LEFTSIDE + " " + this.state.whichOperation + " " + RIGHTSIDE + " = " + (LEFTSIDE - RIGHTSIDE));
          break;
        case MULTIPLY:
          this.pushOperandToLast(LEFTSIDE * RIGHTSIDE);
          console.log(LEFTSIDE + " " + this.state.whichOperation + " " + RIGHTSIDE + " = " + (LEFTSIDE * RIGHTSIDE));
          break;
        case DIVIDE:
          this.pushOperandToLast(LEFTSIDE / RIGHTSIDE);
          console.log(LEFTSIDE + " " + this.state.whichOperation + " " + RIGHTSIDE + " = " + (LEFTSIDE / RIGHTSIDE));
          break;
      }
      this.clearOperand();
      this.setOperation(OPERATION);
      
    }

    // This is for if we have an operation in 
    else {
      this.setOperation(OPERATION);
      this.pushOperandToLast(this.state.operand);
      this.clearOperand();
    }

    /*
    if (this.state.operand=='0' && this.state.lastOperand == '') {
      return;
    }

    else if (this.state.operand) {
      this.updateUpperDisplay(this.state.operand);
      this.clearOperand();
      this.setState({lastOperand: this.state.operand});
      this.setOperation(OPERATION);     
    }

    else {
      this.setOperation(OPERATION);
    }
    */
  }

  render() {
    return(
      <div class="calculator-grid">
        <div class="display">
          <p class="display_top">{this.state.upDisplay}</p>
          <p class="display_bottom">{this.state.lowDisplay}</p>
        </div>
        <button class="b b-ac" onClick={this.clickClear}>AC</button>
        <button class="b b-divide" onClick={this.clickOperation}>/</button>
        <button class="b b-multiply" onClick={this.clickOperation}>x</button>
        <button class="b b-7" onClick={this.clickNumber}>7</button>
        <button class="b b-8" onClick={this.clickNumber}>8</button>
        <button class="b b-9" onClick={this.clickNumber}>9</button>
        <button class="b b-subtract" onClick={this.clickOperation}>-</button>
        <button class="b b-4" onClick={this.clickNumber}>4</button>
        <button class="b b-5" onClick={this.clickNumber}>5</button>
        <button class="b b-6" onClick={this.clickNumber}>6</button>
        <button class="b b-add" onClick={this.clickOperation} >+</button>
        <button class="b b-1" onClick={this.clickNumber}>1</button>
        <button class="b b-2" onClick={this.clickNumber}>2</button>
        <button class="b b-3" onClick={this.clickNumber}>3</button>
        <button class="b b-equals" onClick={this.clickEvaluate}>=</button>
        <button class="b b-0" onClick={this.clickNumber}>0</button>
        <button class="b b-dot" onClick={this.clickDecimal}>.</button>
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    
    
    this.state = {
      input: []
    }
  }
  
  render() {
    return( 
      <div id="calculator-board">
        <div class="calculator">
          <CalculatorGrid />
        </div>
      </div>
    );
  }
}


export default Calculator;
