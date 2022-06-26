/**
 * File Name    : data.js
 * Description  : This file contains code that deals with data handling functionalities
 *                such as fetching and saving data to account details
 * Author       : Goutham
 * Last updated : 26-Jun-2022
 */


// Data to store the bank account details
// This can be replaced by a database when a database is used
accountDetails = {}

// This class deals with Fetching the data from account details
class FetchAccountData {

    /**
     * This function returns a account number for new customer which is different from
     * existing account numbers.
     * @returns {Number} Account number for new customer.
     */
    getNewAccountNumber(){
        let newAccountNumber;
        let accountNumbers = Object.keys(accountDetails);
        if(accountNumbers.length == 0)
            // First account number
            newAccountNumber = 1001;
        else
            // Find the maximum account number and increase by 1 => new account number
            newAccountNumber = accountNumbers.map(Number)
                                .reduce((acc1, acc2) => acc1 > acc2 ? acc1 : acc2) + 1;

        return newAccountNumber;
    }

    /**
     * This function fetch and returns account details for a particular account number.
     * @param {Number} accountNumber : Account number to fetch details.
     * @returns {Object} Account details of the given account number with the following
     *                   properties
     *                      'name' : String,
     *                      'balance' : Number,
     *                      'nWithdrawals' : Number,
     *                      'nDeposits' : Number,
     *                      'lastUpdatedDate' : String
     */
    getDataByAccountNumber(accountNumber){
        let accountNumbers = Object.keys(accountDetails).map(Number);
        if(accountNumbers.includes(accountNumber)){
            return accountDetails[accountNumber];
        }
        else{
            throw 'Invalid Account Number';
        }
    }
}

// Base class to save changes to the account details
class SaveChanges{
    saveToAccountData() {};
}

// Saves new account information to account details
class SaveNewAccount extends SaveChanges {

    /**
     * Create a new account with the given account number and account data
     * @param {Number} accountNumber : Account number to create new account
     * @param {Object} accountData : Account information of new account with properties
     *                                  'name' : String,
     *                                  'balance' : Number,
     *                                  'nWithdrawals' : Number,
     *                                  'nDeposits' : Number,
     *                                  'lastUpdatedDate' : String
     */
    saveToAccountData(accountNumber, accountData) {
        if(Object.keys(accountDetails).map(Number).includes(accountNumber)) {
            throw "Account Number already exists";
        }
        else{
            accountDetails[accountNumber] = accountData;
        }
    }
}

// Updates an existing account information in account details
class UpdateAccountData extends SaveChanges {

    /**
     * Update the existing account of given account number with given account information.
     * @param {Number} accountNumber : Account number to update
     * @param {Object} accountData : Account information with properties
     *                                  'name' : String,
     *                                  'balance' : Number,
     *                                  'nWithdrawals' : Number,
     *                                  'nDeposits' : Number,
     *                                  'lastUpdatedDate' : String
     */
    saveToAccountData(accountNumber, accountData) {
        if(Object.keys(accountDetails).map(Number).includes(accountNumber)) {
            accountDetails[accountNumber] = accountData;
        }
        else
            throw "Invalid Account Number";
    }
}

module.exports = {
    FetchAccountData,
    SaveNewAccount,
    UpdateAccountData
}