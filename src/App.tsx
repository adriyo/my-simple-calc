import { useCallback, useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";

const Button = styled.button({
  flex: 1,
  borderRadius: 0,
  fontSize: "40px",
});

const YellowButton = styled(Button)`
  background-color: #fea005;
`;

const GreyButton = styled(Button)`
  background-color: #5c6265;
`;

const DarkGreyButton = styled(Button)`
  background-color: #3d3d3e;
`;

const Container = styled.div({
  width: "100vw",
  height: "100vh",
  maxWidth: "912px",
  background: "#292d30",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gridGap: "2px",
});

const Wrapper = styled.div({
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
});

type Operator = "+" | "-" | "x" | "/" | "=" | "+/-" | "%" | "";

function App() {
  const [displayedValue, setDisplayedValue] = useState("0");
  const [operator, setOperator] = useState<Operator>("");
  const [prevValue, setPrevValue] = useState<string>("");

  const handleNumberClick = useCallback(
    (number: string) => {
      if (displayedValue === "0") {
        setDisplayedValue(number);
      } else if (operator === "=") {
        setDisplayedValue(number);
        setOperator("");
      } else {
        setDisplayedValue((prevValue) => prevValue + number);
      }
    },
    [displayedValue, operator]
  );

  const handleOperatorClick = useCallback(
    (operatorValue: Operator) => {
      if (operatorValue == "%") {
        setDisplayedValue((prevValue) => {
          const currentValue = parseFloat(prevValue);
          return calculate(currentValue, 100, "/").toString();
        });
      } else if (operatorValue === "+/-") {
        setDisplayedValue((prevValue) => {
          const currentValue = parseFloat(prevValue);
          return (
            (currentValue === 0 ? "" : currentValue > 0 ? "-" : "") +
            Math.abs(currentValue).toString()
          );
        });
      } else if (operatorValue === "=") {
        if (operator && prevValue) {
          const result = calculate(
            parseFloat(prevValue),
            parseFloat(displayedValue),
            operator
          );
          setDisplayedValue(result.toString());
          setOperator("=");
          setPrevValue("");
        }
      } else {
        setOperator(operatorValue);
        setPrevValue(displayedValue);
        setDisplayedValue("0");
      }
    },
    [displayedValue, operator, prevValue]
  );

  const handleClearClick = useCallback(() => {
    setDisplayedValue("0");
    setOperator("");
    setPrevValue("");
  }, []);

  console.log(
    `prevValue: ${prevValue}, displayedValue: ${displayedValue}, operator: ${operator}`
  );
  const calculate = (
    value1: number,
    value2: number,
    operator: Operator
  ): number => {
    switch (operator) {
      case "+":
        return value1 + value2;
      case "-":
        return value1 - value2;
      case "x":
        return value1 * value2;
      case "/":
        return value1 / value2;
      default:
        return value2;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (/[0-9]/.test(key)) {
        handleNumberClick(key);
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        handleOperatorClick(key === "*" ? "x" : key);
      } else if (key === "=" || key === "Enter") {
        handleOperatorClick("=");
      } else if (key === "Backspace") {
        handleClearClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNumberClick, handleOperatorClick, handleClearClick]);

  return (
    <>
      <Wrapper>
        <Container>
          <div
            style={{
              gridColumn: "span 4",
              backgroundColor: "#2e2e2e",
              fontSize: "80px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span>{displayedValue ? displayedValue : "0"}</span>
          </div>
          <DarkGreyButton onClick={handleClearClick}>C</DarkGreyButton>
          <DarkGreyButton onClick={() => handleOperatorClick("+/-")}>
            +/-
          </DarkGreyButton>
          <DarkGreyButton onClick={() => handleOperatorClick("%")}>
            %
          </DarkGreyButton>
          <YellowButton onClick={() => handleOperatorClick("/")}>
            /
          </YellowButton>
          <GreyButton onClick={() => handleNumberClick("7")}>7</GreyButton>
          <GreyButton onClick={() => handleNumberClick("8")}>8</GreyButton>
          <GreyButton onClick={() => handleNumberClick("9")}>9</GreyButton>
          <YellowButton onClick={() => handleOperatorClick("x")}>
            x
          </YellowButton>
          <GreyButton onClick={() => handleNumberClick("4")}>4</GreyButton>
          <GreyButton onClick={() => handleNumberClick("5")}>5</GreyButton>
          <GreyButton onClick={() => handleNumberClick("6")}>6</GreyButton>
          <YellowButton onClick={() => handleOperatorClick("-")}>
            -
          </YellowButton>
          <GreyButton onClick={() => handleNumberClick("1")}>1</GreyButton>
          <GreyButton onClick={() => handleNumberClick("2")}>2</GreyButton>
          <GreyButton onClick={() => handleNumberClick("3")}>3</GreyButton>
          <YellowButton onClick={() => handleOperatorClick("+")}>
            +
          </YellowButton>
          <GreyButton
            style={{
              gridColumn: "span 2",
            }}
            onClick={() => handleNumberClick("0")}
          >
            0
          </GreyButton>
          <GreyButton>,</GreyButton>
          <YellowButton onClick={() => handleOperatorClick("=")}>
            =
          </YellowButton>
        </Container>
      </Wrapper>
    </>
  );
}

export default App;
