/**
 * File Name    : index.test.js
 * Description  : This file contains unit test codes for bank account management.
 * Author       : Goutham
 * Last updated : 26-Jun-2022
 */

const {CreateAccount, AccountBalance, Deposit, Withdrawal, Transfer} = require("./index");
const {AccountDetails, FetchAccountData, SaveNewAccount, UpdateAccountData} = require("./data");

let fetchData = new FetchAccountData();
let saveData = new SaveNewAccount();
let updateData = new UpdateAccountData();

let createAccount = new CreateAccount(fetchData, saveData);
let accountBalance = new AccountBalance(fetchData);
let deposit = new Deposit(fetchData, updateData);
let withdrawal = new Withdrawal(fetchData, updateData);
let transfer = new Transfer(updateData, withdrawal, deposit);

describe("account_creation", () =>{
    test("test_create_account_01", () => {
        expect(createAccount.create('Amit Dugal')).toBe(1001);
    })

    test("test_create_account_02", () => {
        expect(createAccount.create('Gauri Kalla')).toBe(1002);
    })

    test("test_create_account_03", () => {
        expect(createAccount.create('Dugal Kalla')).toBe(1003);
    })
})

describe("amount_deposit", () => {
    test("test_amount_deposit_01", () => {
        expect(deposit.depositAmount(1001, 500)).toBe(500);
    })

    test("test_amount_deposit_02", () => {
        expect(deposit.depositAmount(1001, 1000)).toBe(1500);
    })

    test("test_amount_deposit_03", () => {
        expect(deposit.depositAmount(1001, 100)).toBe("Minimum deposit amount is 500");
    })

    test("test_amount_deposit_04", () => {
        expect(deposit.depositAmount(1001, 60000)).toBe("Maximum deposit amount is 50000");
    })

    test("test_amount_deposit_05", () => {
        expect(deposit.depositAmount(1001, 10000)).toBe(11500);
    })

    test("test_amount_deposit_06", () => {
        expect(deposit.depositAmount(1001, 10000)).toBe("Only 3 deposits are allowed in a day");
    })

    test("test_amount_deposit_07", () => {
        expect(deposit.depositAmount(1002, 10000)).toBe(10000);
    })

    test("test_amount_deposit_08", () => {
        expect(deposit.depositAmount(1002, 50000)).toBe(60000);
    })

    test("test_amount_deposit_09", () => {
        expect(deposit.depositAmount(1002, 50000)).toBe("Account balance cannot exceed 100000");
    })

    test("test_amount_deposit_10", () => {
        expect(deposit.depositAmount(1005, 50000)).toBe("Invalid Account Number");
    })
})

describe("account_balance", () => {
    test("test_account_balance_01", () => {
        expect(accountBalance.getBalance(1001)).toBe(11500);
    })

    test("test_account_balance_02", () => {
        expect(accountBalance.getBalance(1004)).toBe("Invalid Account Number");
    })
})

describe("amount_withdrawal", () => {
    test("test_amount_withdrawal_01", () => {
        expect(withdrawal.withdrawAmount(1001, 500)).toBe("Minimum withdrawal amount is 1000");
    })

    test("test_amount_withdrawal_02", () => {
        expect(withdrawal.withdrawAmount(1001, 20000)).toBe("Insufficient balance");
    })

    test("test_amount_withdrawal_03", () => {
        expect(withdrawal.withdrawAmount(1001, 1000)).toBe(10500);
    })

    test("test_amount_withdrawal_04", () => {
        expect(withdrawal.withdrawAmount(1001, 1900)).toBe(8600);
    })

    test("test_amount_withdrawal_05", () => {
        expect(withdrawal.withdrawAmount(1001, 1000)).toBe(7600);
    })

    test("test_amount_withdrawal_06", () => {
        expect(withdrawal.withdrawAmount(1001, 5000)).toBe("Only 3 withdrawals are allowed in a day");
    })

    test("test_amount_withdrawal_07", () => {
        expect(withdrawal.withdrawAmount(1005, 5000)).toBe("Invalid Account Number");
    })
})

describe("amount_transfer", () => {
    test("test_amount_transfer_01", () => {
        expect(transfer.transferAmount(1002, 1003, 5000)).toBe("Successful");
    })

    test("test_amount_transfer_02", () => {
        expect(transfer.transferAmount(1002, 1003, 500)).toBe("Minimum withdrawal amount is 1000 for account 1002");
    })

    test("test_amount_transfer_03", () => {
        expect(transfer.transferAmount(1002, 1003, 30000)).toBe("Maximum withdrawal amount is 25000 for account 1002");
    })

    test("test_amount_transfer_04", () => {
        expect(transfer.transferAmount(1003, 1005, 1000)).toBe("Invalid Account Number for account 1005");
    })
})