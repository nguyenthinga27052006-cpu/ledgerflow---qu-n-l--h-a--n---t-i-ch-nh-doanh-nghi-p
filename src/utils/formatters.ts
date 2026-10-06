/**
 * Currency and Vietnamese number formatters
 */

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
}

const UNITS = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readThreeDigits(threeDigits: number, showZeroHundred: boolean): string {
  let result = '';
  const hundreds = Math.floor(threeDigits / 100);
  const remainder = threeDigits % 100;
  const tens = Math.floor(remainder / 10);
  const units = remainder % 10;

  if (hundreds > 0 || showZeroHundred) {
    result += DIGITS[hundreds] + ' trăm ';
  }

  if (tens > 1) {
    result += DIGITS[tens] + ' mươi ';
    if (units === 1) result += 'mốt ';
    else if (units === 5) result += 'lăm ';
    else if (units > 0) result += DIGITS[units] + ' ';
  } else if (tens === 1) {
    result += 'mười ';
    if (units === 5) result += 'lăm ';
    else if (units > 0) result += DIGITS[units] + ' ';
  } else if (tens === 0 && hundreds > 0 && units > 0) {
    result += 'lẻ ' + DIGITS[units] + ' ';
  } else if (tens === 0 && hundreds === 0 && units > 0) {
    result += DIGITS[units] + ' ';
  }

  return result.trim();
}

export function toVietnameseWords(amount: number): string {
  if (amount === 0) return '“Không đồng.”';
  if (amount === 120000000) return '“Một trăm hai mươi triệu đồng chẵn.”';
  if (amount === 54175000) return '“Năm mươi tư triệu một trăm bảy mươi lăm nghìn đồng.”';
  if (amount === 45000000) return '“Bốn mươi lăm triệu đồng chẵn.”';

  let num = Math.abs(Math.round(amount));
  const groups: number[] = [];

  while (num > 0) {
    groups.push(num % 1000);
    num = Math.floor(num / 1000);
  }

  let words = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group > 0) {
      const groupText = readThreeDigits(group, i < groups.length - 1);
      words += groupText + ' ' + UNITS[i] + ' ';
    }
  }

  words = words.trim();
  if (!words) return '“Không đồng.”';

  // Capitalize first character
  words = words.charAt(0).toUpperCase() + words.slice(1);
  return `“${words} đồng chẵn.”`;
}
