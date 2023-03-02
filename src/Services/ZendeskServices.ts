const axios = require('axios');

export default class ZendeskServices {

  // create org in zendesk
  async createZendeskOrganisation(params: Object) {
    await axios.post(`${process.env.ZENDESK_BASE_URL}api/v2/organizations`, { "organization": params }, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw new Error(error.response.data.details);
    })
  }

  // delete org in zendesk
  async deleteZendeskOrganisation(params: any) {
    await axios.delete(`${process.env.ZENDESK_BASE_URL}api/v2/organizations/${params.zendeskOrgId}`, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw new Error(error.response.data.details);
    })
  }


  // delete org in zendesk
  async updateZendeskOrganisation(params: any) {
    await axios.put(`${process.env.ZENDESK_BASE_URL}api/v2/organizations/${params.zendeskOrgId}`, { "organization": params }, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw new Error(error.response.data.details);
    })
  }



  // get org list from zendesk
  async getZendeskOrganizationsList() {
    const data = await axios.get(`${process.env.ZENDESK_BASE_URL}api/v2/organizations`, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw error
    })

    return data
  }

  // create zendesk user
  async createZendeskUser(params: any) {
    const data = await axios.post(`${process.env.ZENDESK_BASE_URL}api/v2/users`, { "user": params }, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw new Error(error.response.data.details);
    })

    return data
  }

  // update zendesk user
  public async updateZendeskUser(params: any) {
    const data = await axios.put(`${process.env.ZENDESK_BASE_URL}api/v2/users/${params.zendeskUserId}`, { "user": params }, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw error
    })
    return data
  }

  // get zendesk identity userid
  public async getUserIdentities(id: string) {
    const data = await axios.get(`${process.env.ZENDESK_BASE_URL}api/v2/users/${id}/identities`, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw error
    })
    return data
  }

  // make zendesk user email primary
  public async makeZendeskUserEmailPrimary(params: any) {
    const data = await axios.put(`${process.env.ZENDESK_BASE_URL}api/v2/users/${params.user_id}/identities/${params.id}/make_primary`, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw error
    })
    return data
  }

  // upload attechment in zendesk
  public async uploadAttechment(filename: string, params: any) {
    const data = await axios.post(`${process.env.ZENDESK_BASE_URL}api/v2/uploads.json?filename=${filename}`, params, {
      headers: {
        'Content-Type': 'image/png',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw error
    })
    return data
  }

  // crete ticket in zendesk
  public async createSupportTicket(params: any) {
    const data = await axios.post(`${process.env.ZENDESK_BASE_URL}api/v2/tickets.json`, { "ticket": params }, {
      headers: {
        'Content-Type': 'application/json',
        "Accept-Encoding": "gzip,deflate,compress",
        'Authorization': `Basic ${process.env.ZENDESK_API_KEY_BASE_64}`
      }
    }).then((result: any) => {
      return result.data
    }).catch((error: any) => {
      throw error
    })
    return data
  }

}