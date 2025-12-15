import React, { useEffect } from "react";
import { Button, Descriptions, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, logoutUserApi } from "../api/authApi";
import { logout, setCredentials } from "../store/authSlice";
import { RootState } from "../store/store";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getProfile();
        if (accessToken) {
          dispatch(setCredentials({ accessToken, user: userData }));
        }
      } catch (e) {
        // ИСПРАВЛЕНО: Замена console.error на message.error
        message.error("Ошибка загрузки профиля");
      }
    };
    fetchData();
  }, [dispatch, accessToken]);

  const handleLogout = async () => {
    try {
      await logoutUserApi();
    } catch (e) {
      console.error(e); // Оставляем, так как API-функция уже обрабатывает очистку токена
    }
    dispatch(logout());
    message.info("Вы вышли из системы");
  };

  if (!user) return <p>Загрузка данных...</p>;

  return (
    <div>
      <h2>Личный кабинет</h2>
      <Descriptions bordered layout="vertical">
        <Descriptions.Item label="Имя">{user.username}</Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Телефон">
          {user.phoneNumber || "-"}
        </Descriptions.Item>
      </Descriptions>

      <Button
        type="primary"
        danger
        onClick={handleLogout}
        style={{ marginTop: 20 }}
      >
        Выйти из аккаунта
      </Button>
    </div>
  );
}