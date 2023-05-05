
const axios = require('axios')

async function asana_tasks(req, res) {
    const API_ASANA = process.env.ASANA_API_KEY;

  try {
    const options = {
      method: 'GET',
      url: 'https://app.asana.com/api/1.0/projects/1204311785967047/tasks?opt_fields=name,custom_fields.display_value,memberships.section.name,custom_fields.display_value,notes',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${API_ASANA}`
      }
    };
    const response = await axios(options);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ message: error.message });
  }
}




async function asanaHandler(req, res) {
 
    const API_ASANA = process.env.ASANA_API_KEY;
    const PROJECT = process.env.ASANA_PROJECT
    const WORKSPACE=process.env.ASANA_WORKSPACE
    const SECTION = process.env.ASANA_SECTION
    const CUSTOMFIELD = process.env.ASANA_CUSTOM_FIELDS



  if (req.method === 'POST') {
    const { title, customFieldValue, description } = req.body;

    const data = {
      data: {
        custom_fields: {'1204312101738449': customFieldValue,
        '1204495418323075':'1204495418323076'
      },
        projects: [PROJECT],
        workspace: WORKSPACE,
        assignee_section: SECTION,
        name: title,
        notes:description,
      }
    };

    const options = {
      method: 'POST',
      url: 'https://app.asana.com/api/1.0/tasks',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${API_ASANA}`
      },
      data,
    };

    try {
      const response = await axios.request(options);
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}


module.exports={
    asana_tasks,
    asanaHandler
}



