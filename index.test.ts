import { expect, test } from "@jest/globals";
import { interpretString } from ".";

test("1 + 2 = 3", () => {
  expect(interpretString("1 + 2")).toStrictEqual([3]);
});

test("2 * 3 = 6", () => {
  expect(interpretString("2 * 3")).toStrictEqual([6]);
});

test("5 - 3 = 2", () => {
  expect(interpretString("5 - 3")).toStrictEqual([2]);
});

test("8 / 4 = 2", () => {
  expect(interpretString("8 / 4")).toStrictEqual([2]);
});

test("1 + 2 * 3 = 7", () => {
  expect(interpretString("1 + 2 * 3")).toStrictEqual([7]);
});

test("(1 + 2) * 3 = 9", () => {
  expect(interpretString("(1 + 2) * 3")).toStrictEqual([9]);
});

test("a = 3; b = a + 2; b", () => {
  expect(interpretString("a = 3; b = a + 2; b")).toStrictEqual([5]);
});

test("(((1 + 2))) * 3 = 9", () => {
  expect(interpretString("(((1 + 2))) * 3")).toStrictEqual([9]);
});
