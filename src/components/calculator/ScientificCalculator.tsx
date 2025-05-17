import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, RotateCcw } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/components/ui/use-toast";

const ScientificCalculator = () => {
  const [display, setDisplay] = useState<string>("0");
  const [memory, setMemory] = useState<number | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);
  const [previousOperator, setPreviousOperator] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  
  const isMobile = useMediaQuery("xs");
  const { toast } = useToast();
  
  // Handle digit button clicks
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };
  
  // Handle decimal point
  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };
  
  // Clear all inputs and reset calculator
  const clearAll = () => {
    setDisplay("0");
    setPreviousOperator(null);
    setPreviousValue(null);
    setWaitingForOperand(false);
  };
  
  // Clear current entry
  const clearEntry = () => {
    setDisplay("0");
  };
  
  // Change sign of the displayed number
  const changeSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };
  
  // Handle basic operations (add, subtract, multiply, divide)
  const handleOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (previousOperator) {
      const result = performCalculation(previousValue, inputValue, previousOperator);
      setPreviousValue(result);
      setDisplay(String(result));
    }
    
    setWaitingForOperand(true);
    setPreviousOperator(nextOperator);
  };
  
  // Perform calculation based on operator
  const performCalculation = (firstValue: number, secondValue: number, operator: string): number => {
    switch (operator) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "^":
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };
  
  // Handle equals button
  const handleEquals = () => {
    const inputValue = parseFloat(display);
    
    if (previousOperator && previousValue !== null) {
      const result = performCalculation(previousValue, inputValue, previousOperator);
      setDisplay(String(result));
      setPreviousValue(null);
      setPreviousOperator(null);
    }
    
    setWaitingForOperand(true);
  };
  
  // Scientific functions
  const calculateSquareRoot = () => {
    const value = parseFloat(display);
    if (value < 0) {
      toast({
        title: "Chyba",
        description: "Nelze vypočítat odmocninu záporného čísla",
        variant: "destructive"
      });
      return;
    }
    const result = Math.sqrt(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateSquare = () => {
    const value = parseFloat(display);
    const result = value * value;
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateSin = () => {
    const value = parseFloat(display) * (Math.PI / 180); // Convert to radians
    const result = Math.sin(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateCos = () => {
    const value = parseFloat(display) * (Math.PI / 180); // Convert to radians
    const result = Math.cos(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateTan = () => {
    const value = parseFloat(display) * (Math.PI / 180); // Convert to radians
    
    // Check if cosine is zero (which would make tangent undefined)
    const cosValue = Math.cos(value);
    if (Math.abs(cosValue) < 1e-10) {
      toast({
        title: "Chyba",
        description: "Hodnota tangens je nedefinována pro tento úhel",
        variant: "destructive"
      });
      return;
    }
    
    const result = Math.tan(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateLog = () => {
    const value = parseFloat(display);
    if (value <= 0) {
      toast({
        title: "Chyba",
        description: "Logaritmus lze vypočítat pouze pro kladná čísla",
        variant: "destructive"
      });
      return;
    }
    const result = Math.log10(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateLn = () => {
    const value = parseFloat(display);
    if (value <= 0) {
      toast({
        title: "Chyba",
        description: "Přirozený logaritmus lze vypočítat pouze pro kladná čísla",
        variant: "destructive"
      });
      return;
    }
    const result = Math.log(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  const calculateExp = () => {
    const value = parseFloat(display);
    const result = Math.exp(value);
    setDisplay(String(result));
    setWaitingForOperand(true);
  };
  
  // Memory functions
  const memoryClear = () => {
    setMemory(null);
    toast({
      title: "Paměť vymazána",
      description: "Hodnota v paměti byla vymazána."
    });
  };
  
  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory));
    }
  };
  
  const memoryAdd = () => {
    const value = parseFloat(display);
    setMemory((prev) => (prev !== null ? prev + value : value));
    toast({
      title: "Přidáno do paměti",
      description: "Hodnota byla přidána do paměti."
    });
  };
  
  const memorySubtract = () => {
    const value = parseFloat(display);
    setMemory((prev) => (prev !== null ? prev - value : -value));
    toast({
      title: "Odečteno z paměti",
      description: "Hodnota byla odečtena z paměti."
    });
  };
  
  // Constants
  const inputPi = () => {
    setDisplay(String(Math.PI));
    setWaitingForOperand(false);
  };
  
  const inputE = () => {
    setDisplay(String(Math.E));
    setWaitingForOperand(false);
  };
  
  // Button size and styles based on device
  const buttonSize = isMobile ? "sm" : "default";
  const buttonClass = "font-mono h-12 w-full text-md";
  
  return (
    <Card className="h-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Vědecká kalkulačka</CardTitle>
        </div>
        <CardDescription>
          Pokročilá kalkulačka pro matematické a vědecké výpočty
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-muted p-4 rounded-md">
          <Input
            className="text-xl h-12 font-mono text-right"
            value={display}
            readOnly
            disabled
          />
        </div>
        
        {/* Memory status indicator */}
        <div className="text-xs text-muted-foreground text-right">
          {memory !== null && <span>M = {memory}</span>}
        </div>
        
        {/* Calculator buttons */}
        <div className="grid grid-cols-4 gap-2 md:grid-cols-5">
          {/* Memory functions */}
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={memoryClear}
          >
            MC
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={memoryRecall}
          >
            MR
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={memoryAdd}
          >
            M+
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={memorySubtract}
          >
            M-
          </Button>
          
          {/* Constants and scientific functions - show only on tablet and larger */}
          {!isMobile && (
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={inputPi}
            >
              π
            </Button>
          )}
          
          {/* Basic functions */}
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={clearAll}
          >
            AC
          </Button>
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={clearEntry}
          >
            CE
          </Button>
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={changeSign}
          >
            ±
          </Button>
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={() => handleOperation("÷")}
          >
            ÷
          </Button>
          
          {/* Scientific functions - show only on tablet and larger */}
          {!isMobile && (
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={inputE}
            >
              e
            </Button>
          )}
          
          {/* Numbers and operations */}
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("7")}
          >
            7
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("8")}
          >
            8
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("9")}
          >
            9
          </Button>
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={() => handleOperation("×")}
          >
            ×
          </Button>
          
          {/* Scientific functions - show only on tablet and larger */}
          {!isMobile && (
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={calculateSquare}
            >
              x²
            </Button>
          )}
          
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("4")}
          >
            4
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("5")}
          >
            5
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("6")}
          >
            6
          </Button>
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={() => handleOperation("-")}
          >
            -
          </Button>
          
          {/* Scientific functions - show only on tablet and larger */}
          {!isMobile && (
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={calculateSquareRoot}
            >
              √
            </Button>
          )}
          
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("1")}
          >
            1
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("2")}
          >
            2
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("3")}
          >
            3
          </Button>
          <Button
            size={buttonSize}
            variant="secondary"
            className={buttonClass}
            onClick={() => handleOperation("+")}
          >
            +
          </Button>
          
          {/* Scientific functions - show only on tablet and larger */}
          {!isMobile && (
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={() => handleOperation("^")}
            >
              x^y
            </Button>
          )}
          
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={() => inputDigit("0")}
          >
            0
          </Button>
          <Button
            size={buttonSize}
            variant="default"
            className={buttonClass}
            onClick={inputDot}
          >
            .
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={() => setDisplay("0")}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size={buttonSize}
            variant="default" // Changed from "primary" to "default"
            className={`${buttonClass} bg-primary`}
            onClick={handleEquals}
          >
            =
          </Button>
          
          {/* Scientific functions - show only on tablet and larger */}
          {!isMobile && (
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={calculateLog}
            >
              log
            </Button>
          )}
        </div>
        
        {/* Scientific functions - show only on mobile devices in a separate row */}
        {isMobile && (
          <div className="grid grid-cols-4 gap-2 mt-2">
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={calculateSquare}
            >
              x²
            </Button>
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={calculateSquareRoot}
            >
              √
            </Button>
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={inputPi}
            >
              π
            </Button>
            <Button
              size={buttonSize}
              variant="outline"
              className={buttonClass}
              onClick={inputE}
            >
              e
            </Button>
          </div>
        )}
        
        {/* Additional scientific functions row */}
        <div className="grid grid-cols-4 gap-2">
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={calculateSin}
          >
            sin
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={calculateCos}
          >
            cos
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={calculateTan}
          >
            tan
          </Button>
          <Button
            size={buttonSize}
            variant="outline"
            className={buttonClass}
            onClick={calculateLn}
          >
            ln
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScientificCalculator;
