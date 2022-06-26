/**
 * File Name    : index.js
 * Description  : This file contains code that deals with bank account management such as
 *                account creation, deposit, withdrawal and transfer.
 * Author       : Goutham
 * Last updated : 26-Jun-2022
 */

 var config = require('./config');

// This class deals with account creation for new customers
class CreateAccount{

    /**
     * Intialize data objects
     * @param {FetchAccountData} dataFetch : Object of class to fetch data from account
     * @param {SaveNewAccount} dataSave : Object of class to store new account data
     */
    constructor(dataFetch, dataSave){
        this.dataFetch = dataFetch;
        this.dataSave = dataSave;
    }

    /**
     * This function creates a new account using the given account holder name
     * @param {String} accountHolderName : Name of the new account holder
     * @returns {Number} : Account number of the newly created account
     */
    create(accountHolderName){
        let accountNumber = this.dataFetch.getNewAccountNumber();

        // Details of the new account
        let accountData = {
            'name' : accountHolderName,
            'balance' : 0,
            'nWithdrawals' : 0,
            'nDeposits' : 0,
            'lastUpdatedDate' : new Date().toDateString()
        }

        // Save the new account details
        this.dataSave.saveToAccountData(accountNumber, accountData);
        return accountNumber;
    }
}

// This class fetchs the balance from the account
class AccountBalance{

    /**
     * Intialize data objects
     * @param {FetchAccountData} dataFetch : Object of class to fetch data from account
     */
    constructor(dataFetch){
        this.dataFetch = dataFetch;
    }

    /**
     * This function is used to fetch the balance of the given account number
     * @param {Number} accountNumber : Account number to fetch balance
     * @returns {Number} : Balance from the given account number
     */
    getBalance(accountNumber){
        try {
            let accountData = this.dataFetch.getDataByAccountNumber(accountNumber);
            return accountData.balance;
        } catch (error) {
            return error;
        }
    }
}

// This class is used to deposit amount into account
class Deposit{

    /**
     * Intialize data objects
     * @param {FetchAccountData} dataFetch : Object of class to fetch data from account
     * @param {UpdateAccountData} dataSave : Object of class to update account details
     */
    constructor(dataFetch, dataSave){
        this.dataFetch = dataFetch;
        this.dataSave = dataSave;
    }

    /**
     * This function is used to deposit the given amount in the given account number
     * @param {Number} accountNumber : Account number to deposit the amount
     * @param {Number} amount : Amount to deposit in the account
     * @param {boolean} update : Whether to update the changes in the account
     * @returns {Number} Account balance after deposit
     */
    depositAmount(accountNumber, amount, update=true) {

        // Check for mimimum and maximum limit for amount
        if(amount < config.minDeposit)
            return "Minimum deposit amount is 500";
        else if (amount > config.maxDeposit)
            return "Maximum deposit amount is 50000";

        try {
            // Fetch account details
            let accountData = this.dataFetch.getDataByAccountNumber(accountNumber);
            let currentDate = new Date().toDateString();

            // Update deposit limit
            if(accountData.lastUpdatedDate != currentDate){
                accountData.nDeposits = 0;
                accountData.lastUpdatedDate = currentDate;
            }

            // Check for deposit limit
            if(accountData.nDeposits < config.depositLimit){
                let newBalance = accountData.balance + amount;

                // Check for maximum balance limit
                if(newBalance <= config.maxBalance){
                    accountData.balance = newBalance;
                    accountData.nDeposits += 1;

                    if(update)
                    {
                        // Update the changes in the account
                        this.dataSave.saveToAccountData(accountNumber, accountData);
                        return accountData.balance;
                    }
                    else
                        return accountData;
                }
                else
                    return "Account balance cannot exceed 100000";
            }
            else
                return "Only 3 deposits are allowed in a day";

        } catch (error) {
            return error;
        }
    }

}

// This class is used to withraw from the account
class Withdrawal{

    /**
     * Intialize data objects
     * @param {FetchAccountData} dataFetch : Object of class to fetch data from account
     * @param {UpdateAccountData} dataSave : Object of class to update account details
     */
    constructor(dataFetch, dataSave){
        this.dataFetch = dataFetch;
        this.dataSave = dataSave;
    }

    /**
     * This function is used to withdraw the given amount from the given account number
     * @param {Number} accountNumber : Account number to withdraw the amount
     * @param {Number} amount : Amount to withdraw from the account
     * @param {boolean} update : Whether to update the changes in the account
     * @returns {Number} Account balance after withdrawal
     */
    withdrawAmount(accountNumber, amount, update=true) {

        // Check for minimum and maximum limit for amount
        if(amount < config.minWithdrawal)
            return "Minimum withdrawal amount is 1000";
        else if (amount > config.maxWithdrawal)
            return "Maximum withdrawal amount is 25000";

        try {
            // Fetch account details
            let accountData = this.dataFetch.getDataByAccountNumber(accountNumber);
            let currentDate = new Date().toDateString();

            // Update withdrawal limit
            if(accountData.lastUpdatedDate != currentDate){
                accountData.nWithdrawals = 0;
                accountData.lastUpdatedDate = currentDate;
            }

            // Check for withdrawal limit
            if(accountData.nWithdrawals < config.withdrawalLimit){
                let newBalance = accountData.balance - amount;
                if(newBalance >= config.minBalance){
                    accountData.balance = newBalance;
                    accountData.nWithdrawals += 1;
                    if(update)
                    {
                        // Update the changes in account
                        this.dataSave.saveToAccountData(accountNumber, accountData);
                        return accountData.balance;
                    }
                    else
                        return accountData;
                }
                else
                    return "Insufficient balance";
            }
            else
                return "Only 3 withdrawals are allowed in a day";

        } catch (error) {
            return error;
        }
    }

}


// This class is used to transfer from one account to another
class Transfer {

    /**
     * Initialize the data objects
     * @param {UpdateAccountData} dataSave : Object of class to update account details
     * @param {Withdrawal} withdrawal : Object of Withdrawal class
     * @param {Deposit} deposit : Object of Deposit class
     */
    constructor(dataSave, withdrawal, deposit) {
        this.dataSave = dataSave;
        this.withdrawal = withdrawal;
        this.deposit = deposit;
    }

    /**
     * This function is used to transfer given amount from one account to another
     * @param {Number} fromAccountNumber : Account number to withdraw amount
     * @param {Number} toAccountNumber : Account number to deposit amount
     * @param {Number} amount : Amount to be transfered
     * @returns {String} : "Successful" if transfer is done otherwise error message
     */
    transferAmount(fromAccountNumber, toAccountNumber, amount){

        // Withdraw from the sender account
        let withdrawalStatus = this.withdrawal.withdrawAmount(fromAccountNumber, amount, false);

        if(typeof withdrawalStatus !== "string"){

            // Deposit in the receiver account
            let depositStatus = this.deposit.depositAmount(toAccountNumber, amount, false);
            if(typeof depositStatus !== "string"){

                // Update changes in account if transfer is successful
                this.dataSave.saveToAccountData(fromAccountNumber, withdrawalStatus);
                this.dataSave.saveToAccountData(toAccountNumber, depositStatus);
                return "Successful";
            }
            else
                return depositStatus + ` for account ${toAccountNumber}`;
        }
        else
            return withdrawalStatus + ` for account ${fromAccountNumber}`;
    }

}

module.exports = {
    CreateAccount,
    AccountBalance,
    Deposit,
    Withdrawal,
    Transfer,
}

