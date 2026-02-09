import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Spin } from "antd";
import { useDispatch } from "react-redux";

import { getProfile } from "../../api/authApi";
import { getAccessToken } from "../../api/tokenService";
import { setUser } from "../../store/authSlice";

const AuthLoader: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const token = getAccessToken();

      if (!token) {
        dispatch(setUser(null));
        setLoading(false);
        return;
      }

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