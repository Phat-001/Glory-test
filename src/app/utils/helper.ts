export function isNumberInNumber(num1: number, num2: number) {
    return num1.toString().toLowerCase().includes(num2.toString());
}

export function isStringInString(str1: string, str2: string) {
    return str1.toLowerCase().includes(str2);
}
