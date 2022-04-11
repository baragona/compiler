#!/usr/bin/env ts-node

type Token = string;
type TokenTree = (Token | TokenTree)[];
type Operator = "+" | "-" | "*" | "/";
const operators: readonly string[] = Object.freeze(["+", "-", "*", "/"]);

type Expression =
  | {
      operator: Operator;
      operands: Expression[];
    }
  | number;

/* 

expression := number | expression bin_operator expression | '(' expression ')' | unary_operator expression 

bin_operator := '+' | '-' | '*' | '/'

unary_operator := '+' | '-'

*/
function tokenizeExpression(exp: string): Token[] {
  const tokens: Token[] = [];
  for (let i = 0; i < exp.length; i++) {
    const c = exp[i];
    if (c === " ") {
      continue;
    }
    if (c === "(") {
      tokens.push(c);
      continue;
    }
    if (c === ")") {
      tokens.push(c);
      continue;
    }
    if (operators.includes(c)) {
      tokens.push(c);
      continue;
    }
    if (c >= "0" && c <= "9") {
      let num = c;
      while (i + 1 < exp.length && exp[i + 1] >= "0" && exp[i + 1] <= "9") {
        num += exp[i + 1];
        i++;
      }
      tokens.push(num);
      continue;
    }
    throw new Error(`Invalid token: ${c}`);
  }
  return tokens;
}

function removeParenthesis(tokens: Token[]): TokenTree {
  // this function removes parenthesis from the tokens
  // so the result is a stream of tokens where some of the tokens are replaced by arrays of tokens
  // e.g. ['(', '1', '+', '2', ')'] -> ['1', '+', '2']
  // e.g. ['(', '1', '+', '2',')', '*', '3'] -> [['1', '+', '2'], '*', '3']

  const newTokens: TokenTree = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "(") {
      // find the matching closing parenthesis
      let j = i + 1;
      let depth = 1;
      while (j < tokens.length) {
        const nextToken = tokens[j];
        if (nextToken === "(") {
          depth++;
        } else if (nextToken === ")") {
          depth--;
          if (depth === 0) {
            break;
          }
        }
        j++;
      }
      if (depth !== 0) {
        throw new Error("unmatched parenthesis");
      }
      const innerTokens = tokens.slice(i + 1, j);
      // remove parenthesis from the inner tokens
      const innerTokensWithoutParenthesis = removeParenthesis(innerTokens);
      newTokens.push(innerTokensWithoutParenthesis);
      i = j;
    } else {
      newTokens.push(token);
    }
  }

  return newTokens;
}

function parseTokensToTree(tokens: TokenTree): Expression {
  const operatorPrecedence: string[][] = [
    ["*", "/"],
    ["+", "-"],
  ];

  for (const precedenceLevel of operatorPrecedence) {
    // for each prcedence level
    // e.g. ['*', '/']
    // scan the tokens from left to right
    // if you find an operator from this precedence level,
    // create a new Expression node with the operator and everything to the left and right of it as children

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (typeof token === "string" && precedenceLevel.includes(token)) {
        const operator: Operator = token as Operator;
        // if the token is an operator from this precedence level
        // create a new Expression node with the operator and everything to the left and right of it as children
        const left = tokens.slice(0, i);
        const right = tokens.slice(i + 1);
        return {
          operator: operator,
          operands: [parseTokensToTree(left), parseTokensToTree(right)],
        };
      }
    }
  }

  if (tokens.length !== 1) {
    throw new Error(
      "If there are no operators, there should be only one token left"
    );
  }

  const token = tokens[0];

  if (typeof token === "string") {
    // check that it is a number
    const value = parseFloat(token);
    if (isNaN(value)) {
      throw new Error(`Invalid number: ${token}`);
    }
    return value;
  }

  if (Array.isArray(token)) {
    // if the token is an array of tokens, recursively parse it
    return parseTokensToTree(token);
  }

  throw new Error(
    "There is only one token, and it is not a string or an array of tokens"
  );
}

function stringToExpression(exp: string): Expression {
  const tokens = tokenizeExpression(exp);
  const tokensWithoutParenthesis = removeParenthesis(tokens);
  console.log(tokensWithoutParenthesis);
  return parseTokensToTree(tokensWithoutParenthesis);
}

// if main.ts is run directly, run the tests
if (require.main === module) {
  const result1 = tokenizeExpression("(1 + 2) * 3");
  console.log(result1);
  const result2 = removeParenthesis(tokenizeExpression("(1 + 2) * 3"));
  console.log(result2);
  const result3 = stringToExpression("(1 + 2) * 3");

  console.log(JSON.stringify(result3, null, 2));

  // run a REPL - read-evaluate-print loop

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", (line: string) => {
    try {
      const result = stringToExpression(line);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  });
}
