const promisePool = require("../database");

exports.getOrganizations = async (req, res) => {
  const userId = req.userId;

  try {
    const sql = `
      SELECT o.* FROM organizations o
      JOIN organization_user_memberships oum ON o.id = oum.organization_id
      WHERE oum.user_id = ?
    `;
    const values = [userId];
    const [organizations] = await promisePool.query(sql, values);
    res.json(organizations);
  } catch (err) {
    console.error("Error fetching user's organizations from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createOrganization = async (req, res) => {
  const { name } = req.body;
  const userId = req.userId;

  try {
    const insertOrgSql = "INSERT INTO organizations (name) VALUES (?)";
    const orgValues = [name];
    const [orgResult] = await promisePool.query(insertOrgSql, orgValues);

    const insertedOrganizationId = orgResult.insertId;

    const insertMembershipSql =
      "INSERT INTO organization_user_memberships (user_id, organization_id) VALUES (?, ?)";
    const membershipValues = [userId, insertedOrganizationId];
    await promisePool.query(insertMembershipSql, membershipValues);

    const insertedOrganization = { id: insertedOrganizationId, name };
    res.status(201).json(insertedOrganization);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "SELECT * FROM organizations WHERE id = ?";
    const values = [id];
    const [organizations] = await promisePool.query(sql, values);

    if (organizations.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organizations[0]);
  } catch (err) {
    console.error("Error fetching organizations from database:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.joinOrganization = async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  try {
    const orgSql =
      "SELECT organization_id FROM organization_invitation_codes WHERE code = ?";
    const [invitations] = await promisePool.query(orgSql, [code]);

    if (invitations.length === 0) {
      return res.status(404).json({ error: "Invalid invitation code" });
    }

    const organizationId = invitations[0].organization_id;

    const memberCheckSql =
      "SELECT * FROM organization_user_memberships WHERE user_id = ? AND organization_id = ?";
    const [members] = await promisePool.query(memberCheckSql, [
      userId,
      organizationId,
    ]);

    if (members.length > 0) {
      return res
        .status(400)
        .json({ error: "User is already a member of the organization" });
    }

    const joinSql =
      "INSERT INTO organization_user_memberships (user_id, organization_id) VALUES (?, ?)";
    await promisePool.query(joinSql, [userId, organizationId]);

    res.json({ message: "Successfully joined the organization" });
  } catch (err) {
    console.error("Error joining organization:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

  exports.getOrganizationDetails = async (req, res) => {
    const { id } = req.params;

    try {
      const orgDetailsSql = "SELECT * FROM organizations WHERE id = ?";
      const [orgDetails] = await promisePool.query(orgDetailsSql, [id]);

      if (orgDetails.length === 0) {
        return res.status(404).json({ error: "Organization not found" });
      }

      const usersSql = `
        SELECT users.* FROM users
        JOIN organization_user_memberships ON users.id = organization_user_memberships.user_id
        WHERE organization_user_memberships.organization_id = ?`;
      const [users] = await promisePool.query(usersSql, [id]);

      
      const response = {
        organization: orgDetails[0],
        users: users,
      };
      
      res.json(response);
    } catch (err) {
      console.error("Error fetching organization details:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  };
