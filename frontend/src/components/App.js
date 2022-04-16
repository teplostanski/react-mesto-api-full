import React, { useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../context/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ConfirmationPopup from "./ConfirmationPopup";

import { Route, Routes, useNavigate } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import Login from "./Login";
import Register from "./Register";
import * as auth from "../utils/auth"
import InfoTooltip from "./InfoTooltip";


function App() {
  const navigate = useNavigate()
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [cardToDelete, setCardToDelete] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isStatusSucces, setisStatusSucces] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  //const navigate = useNavigate()

  useEffect(() => {
    auth.checkToken().then((res) => {
      if (res) {
        setCurrentUserEmail(res.user.email);
        setLoggedIn(true);
        navigate("/");
        Promise.all([api.getInitialCards().then((resultInitialCards) => setCards(resultInitialCards.cards)),
          api.getUserInfo().then((resultUserInfo) => {
            setCurrentUser({
              name: resultUserInfo.user.name,
              about: resultUserInfo.user.about,
              avatar: resultUserInfo.user.avatar,
              _id: resultUserInfo.user._id
            });
          })])
          .then(() => setIsInitialized(true))
          .catch((error) => console.error(error))
      } else {
        setIsInitialized(true);
      }
    }).catch((error) => {
      setIsInitialized(true);
      console.error(error)}
    );
  }, [navigate]);

  function handleUpdateUser(name, about) {
    api
    .updateUserInfo(name, about)
    .then((resultUserInfo) => {
      setCurrentUser({
        name: resultUserInfo.user.name,
        about: resultUserInfo.user.about,
        avatar: resultUserInfo.user.avatar,
        _id: resultUserInfo.user._id
      });
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(link) {
    api.changeAvatar(link)
    .then((resultUserInfo) => {
      setCurrentUser({
        name: resultUserInfo.user.name,
        about: resultUserInfo.user.about,
        avatar: resultUserInfo.user.avatar,
        _id: resultUserInfo.user._id
      });
      closeAllPopups();
    })
      .catch((err) => {
        console.log(err);
      });
  }



  function handleCardLike(card) {
    //const isLiked = card.likes.some((i) => i._id === currentUser._id);
    console.log(card)
    const isLiked = card.likes.includes(currentUser._id);

    api
      .changeCardLikeStatus(card._id, isLiked)
      .then((newCard) => {
        //setCards((state) =>
        //  state.map((c) => (c._id === card._id ? newCard : c))
        //);
        setCards((state) => state.map((c) => c._id === card._id ? newCard.card : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleConfirmationSubmit(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(title, link) {
    api
    .addNewCard(title, link)
      .then((newCard) => {
        setCards([newCard.card, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  };

  function closeOverlay(evt) {
    if (evt.target === evt.currentTarget) {
      closeAllPopups();
    }
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleConfirmationClick = (card) => {
    setIsConfirmationPopupOpen(!isConfirmationPopupOpen);
    setCardToDelete(card);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  };

  function handleLogin() {
    setLoggedIn(true)
  }

  function handleLogout() {
    //setLoggedIn(false)
    api
    .signOut()
      .then(() => {
        //console.log("LOGOUT")
        //navigate("/sign-in")
        window.location.href = '/sign-in';
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleFormAuthPopup(isStatusSucces, message) {
    setIsInfoTooltipPopupOpen(true);
    setisStatusSucces(isStatusSucces);
    setInfoMessage(message);
  }

  function signOut() {
    handleLogout();
    navigate('/sign-in');
  }

  return (

      <CurrentUserContext.Provider value={currentUser}>
        {isInitialized && (
          <div className="page">
          <Header
            onClick={signOut}
            isLoggedIn={loggedIn}
            currentUserEmail={currentUserEmail}
            handleLogout={handleLogout}
          />

            <Routes>
              <Route
                path="/sign-up"
                element={
                  <Register handleInfoTooltip={handleFormAuthPopup} />
                }
              />
              <Route
                path="/sign-in"
                element={
                  <Login handleLogin={handleLogin} handleInfoTooltip={handleFormAuthPopup} />
                }
              />

              <Route
                exact
                path="/"
                element={
                  <RequireAuth redirectTo="./sign-up" loggedIn={loggedIn}>
                    <Main
                      onAddPlace={handleAddPlaceClick}
                      onEditAvatar={handleEditAvatarClick}
                      onEditProfile={handleEditProfileClick}
                      onCardClick={handleCardClick}
                      cards={cards}
                      onCardDelete={handleConfirmationClick}
                      onCardLike={handleCardLike}
                    />
                  </RequireAuth>
                }
              />
            </Routes>
            <Footer />
            <ImagePopup
              card={selectedCard}
              onClose={closeAllPopups}
              closeByOverlay={closeOverlay}
              isOpen={isImagePopupOpen}
            />
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              closeByOverlay={closeOverlay}
            />

            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddNewCard={handleAddPlaceSubmit}
              closeByOverlay={closeOverlay}
            />

            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              closeByOverlay={closeOverlay}
            />

            <InfoTooltip
              isOpen={isInfoTooltipPopupOpen}
              isStatusSucces={isStatusSucces}
              onClose={closeAllPopups}
              closeByOverlay={closeOverlay}
              message={infoMessage}
            />

            <ConfirmationPopup
              isOpen={isConfirmationPopupOpen}
              onClose={closeAllPopups}
              onSubmit={handleConfirmationSubmit}
              card={cardToDelete}
              closeByOverlay={closeOverlay}
            />
            </div>
        )}
      </CurrentUserContext.Provider>
  );
}

export default App;