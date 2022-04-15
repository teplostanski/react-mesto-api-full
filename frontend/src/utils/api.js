import { AUTORIZATION_PARAMS } from "./utils";

class Api {
  constructor(options) {
    this._options = options;
  }

  _fetch(personalMethod, options) {
    return fetch(this._options.baseRoute + personalMethod, {
      credentials: 'include',
      headers: this._options.headers,
      ...options,
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    });
  }

  getUserInfo() {
    return this._fetch("/users/me");
  }

  getInitialCards() {
    return this._fetch("/cards");
  }

  updateUserInfo(name, about) {
    return this._fetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        name: name,
        about: about
      }),
    });
  }

  addNewCard(name, link) {
    return this._fetch("/cards", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        link: link
      }),
    });
  }

  deleteCard(cardId) {
    return this._fetch(`/cards/${cardId}`, {
      method: "DELETE",
    });
  }

  changeCardLikeStatus(cardId, isLiked) {
    return isLiked ? this.deleteLike(cardId) : this.setLike(cardId);
  }

  setLike(cardId) {
    return this._fetch(`/cards/${cardId}/likes/`, {
      method: "PUT",
    });
  }

  deleteLike(cardId) {
    return this._fetch(`/cards/${cardId}/likes/`, {
      method: "DELETE",
    });
  }

  changeAvatar(link) {
    return this._fetch("/users/me/avatar", {
      method: "PATCH",
      body: JSON.stringify({
        avatar: link,
      }),
    });
  }
}

export default new Api(AUTORIZATION_PARAMS);