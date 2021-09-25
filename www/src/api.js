class Api {
  constructor() {
    this.apiUrl = 'http://battleships.dev.sibirix.ru/api';
  }

  start() {
    return this.request({ type: 'start', method: 'POST' });
  }

  status(id, code) {
    return this.request({ type: 'status', id, code });
  }

  placeShip(id, code, data) {
    return this.request({ type: 'place-ship', method: 'POST', data, id, code });
  }

  clear(id, code) {
    return this.request({ type: 'clear-field', method: 'POST', id, code });
  }

  ready(id, code) {
    return this.request({ type: 'ready', method: 'POST', id, code });
  }

  shot(id, code, data) {
    return this.request({ type: 'shot', method: 'POST', data, id, code });
  }

  chatLoad(id, code, lastTime) {
    return this.request({
      type: 'chat-load',
      parameter: lastTime ? `?lastTime=${lastTime}` : undefined,
      id,
      code,
    });
  }

  chatSend(id, code, data) {
    return this.request({ type: 'chat-send', method: 'POST', data, id, code });
  }

  async request({ type, method = 'GET', parameter, data, id, code }) {
    let url;

    if (id && code) {
      url = `${this.apiUrl}/${type}/${id}/${code}`;
    } else {
      url = `${this.apiUrl}/${type}/`;
    }

    if (parameter) {
      url += parameter;
    }

    const init = {
      method,
    };

    if (method === 'POST' && data) {
      init.body = data;
    }

    const response = await fetch(url, init);
    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      throw response.statusText;
    }
  }
}

export const api = new Api();
