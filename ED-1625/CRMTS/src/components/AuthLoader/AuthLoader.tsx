import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { getProfile } from "../../api/authApi";
import { setUser } from "../../store/authSlice";

const AuthLoader: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      try {
        const profile = await getProfile();
        dispatch(setUser(profile));
      } catch {
        dispatch(setUser(null));
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [dispatch]);

  if (loading) {
    return <Spin fullscreen tip="Загрузка..." />;
  }

  return <>{children}</>;
};

export default AuthLoader;