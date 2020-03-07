import React from "react";
import user from "../Assets/user.png";
export default ({ userName, message }) => {
  return (
    <>
      <div className="media">
        <img
          className="rounded-circle align-self-start mr-3"
          src={user}
          alt="Avatar"
        />
        <div className="media-body">
          <h5 className="mt-0">{userName}</h5>
          <p>{message}</p>
        </div>
      </div>
      <div className="dropdown-divider"></div>
    </>
  );
};
