import {API_ENDPOINT} from "./utils";

const noAuthHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

export const register = (email, password) => {
  return fetch(`${API_ENDPOINT}/signup`, {
    method: 'POST',
    headers: noAuthHeaders,
    body: JSON.stringify({
      email: email,
      password: password
    })
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
    return res.json();
  }).then(body => {
    if (body.error) {
      return {error: body.error};
    }
    if (body.message) {
      return {error: body.message};
    }
    return {email: body.user.email};
  });
};

export const authorize = (email, password) => {
  return fetch(`${API_ENDPOINT}/signin`, {
    method: 'POST',
    headers: noAuthHeaders,
    body: JSON.stringify({email, password}),
    credentials: 'include',
  })
    .then((response => {
      if (response.status === 401) {
        return {error: "Вы ввели некорректный email или пароль"};
      }
      if (response.status === 400) {
        return {error: "Проверьте, что заполнили поля 'email' или 'пароль'"};
      }
    }));
};

export const checkToken = (token) => {
  return fetch(`${API_ENDPOINT}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      return data
    });
}
