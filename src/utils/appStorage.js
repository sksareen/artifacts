// src/utils/appStorage.js
export const saveApp = (code, description, modifications) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const app = { id, code, description, modifications };
    localStorage.setItem(`jba_app_${id}`, JSON.stringify(app));
    return id;
  };
  
  export const getShareableLink = (id) => {
    return `${window.location.origin}/app/${id}`;
  };