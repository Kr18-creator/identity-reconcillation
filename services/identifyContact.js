const identifyContact = async (pool, email, phoneNumber) => {
  let query = "SELECT * FROM Contacts WHERE ";
  const queryParams = [];

  if (email) {
    query += "email = ? ";
    queryParams.push(email);
  }

  if (phoneNumber) {
    if (queryParams.length > 0) {
      query += "OR ";
    }
    query += "phoneNumber = ? ";
    queryParams.push(phoneNumber);
  }

  const [existingContacts] = await pool.query(query, queryParams);

  let primaryContact;
  const secondaryContacts = [];
  const uniqueEmails = new Set();
  const uniquePhoneNumbers = new Set();

  if (existingContacts.length > 0) {
    primaryContact = existingContacts.find(
      (c) => c.linkPrecedence === "primary"
    );

    existingContacts.forEach((contact) => {
      if (contact.id !== primaryContact.id) {
        secondaryContacts.push(contact);
      }
      if (contact.email) {
        uniqueEmails.add(contact.email);
      }
      if (contact.phoneNumber) {
        uniquePhoneNumbers.add(contact.phoneNumber);
      }
    });

    if (
      (!existingContacts.map((c) => c.email).includes(email) && email) ||
      (!existingContacts.map((c) => c.phoneNumber).includes(phoneNumber) &&
        phoneNumber)
    ) {
      const [result] = await pool.query(
        "INSERT INTO Contacts (email, phoneNumber, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, 'primary', NOW(), NOW())",
        [email, phoneNumber]
      );

      const newPrimaryContact = {
        id: result.insertId,
        email,
        phoneNumber,
        linkPrecedence: "primary",
      };

      await pool.query(
        "UPDATE Contacts SET linkPrecedence = 'secondary', updatedAt = NOW() WHERE id = ?",
        [primaryContact.id]
      );

      newPrimaryContact.secondaryContacts = [
        ...secondaryContacts,
        primaryContact,
      ];
      uniqueEmails.add(email);
      uniquePhoneNumbers.add(phoneNumber);

      return {
        primaryContact: newPrimaryContact,
        emails: Array.from(uniqueEmails).filter((e) => e),
        phoneNumbers: Array.from(uniquePhoneNumbers).filter((p) => p),
        secondaryContacts,
      };
    }
  } else {
    const [result] = await pool.query(
      "INSERT INTO Contacts (email, phoneNumber, linkPrecedence, createdAt, updatedAt) VALUES (?, ?, 'primary', NOW(), NOW())",
      [email, phoneNumber]
    );

    primaryContact = {
      id: result.insertId,
      email,
      phoneNumber,
      linkPrecedence: "primary",
      secondaryContacts: [],
    };

    uniqueEmails.add(email);
    uniquePhoneNumbers.add(phoneNumber);

    return {
      primaryContact,
      emails: Array.from(uniqueEmails).filter((e) => e),
      phoneNumbers: Array.from(uniquePhoneNumbers).filter((p) => p),
      secondaryContacts,
    };
  }

  return {
    primaryContact,
    emails: Array.from(uniqueEmails).filter((e) => e),
    phoneNumbers: Array.from(uniquePhoneNumbers).filter((p) => p),
    secondaryContacts,
  };
};

module.exports = identifyContact;
