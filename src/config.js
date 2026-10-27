class Config {
  constructor() {
    this.url = 'https://www.comet.com/';
    this.defaultVersion = 'v2';
    this.path = 'api/rest/';
    this.header = 'Authorization';
  }

  /**
   * Returns the URL string for this Comet.API()
   * instance.
   *
   * @returns {string} the URL string
   *
   * @example
   *
   * > api.getUrl();
   * 'https://www.comet.com/api/rest/'
   *
   */

  getUrl() {
    return this.url + this.path;
  }
}

export const config = new Config();
