# Identity Reconciliation API

This project provides an API to manage and reconcile contact identities. The API allows for creating, identifying, and retrieving contacts based on email and phone number. 

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [GET /api/contacts](#get-apicontacts)
  - [POST /api/contacts](#post-apicontacts)
- [Database Schema](#database-schema)
- [Example Requests and Responses](#example-requests-and-responses)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/identity-reconciliation.git
    cd identity-reconciliation
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up MySQL database:
    - Create a MySQL database named `bitespeed`.
    - Update the database connection settings in `index.js` if necessary.

4. Run the server:
    ```sh
    node index.js
    ```

## Usage

Use Postman, curl, or any other HTTP client to interact with the API.

## API Endpoints

### GET /api/contacts

Retrieve all contacts from the database.

#### Request and Response

```http
POST /api/contacts
Content-Type: application/json

{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "123456"
}



{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}



