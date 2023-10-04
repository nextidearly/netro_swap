import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      swap: "Swap",
      stats: "stats",
      iDO: "IDO",
      airdrop: "Airdrop",
      nodes: "Nodes",
      spt: "Swap Tokens",
      swap: "Swap",
      sat: "Select Token",
      stna: "Search Tokens",
      rankings: "Rankings",
      change: "Change",
      name: "Name",
      no: "noe",
      mint: "mint",
      nn: "Node Name",
      mt: "Mint Price",
      mpw: "Max per Wallet",
      approve: "approve",
      manage: "manage",
      rte: "rte",
      ttr: "ttr",
      ulr: "ulr",
      register: "ulr",
      claim: "ulr",
      nds: "nds",
      finance: 'finance'
    },
  },
  ru: {
    translation: {
      swap: "Менять",
      stats: "Статистика",
      ido: "Предпродажа",
      airdrop: "распределение воздуха",
      nodes: "Узлы",
      spt: "Обмен токенов",
      swap: "Изменять",
      sat: "Выберите токен",
      stna: "Поиск имени или адреса токена",
      rankings: "Рейтинги",
      change: "Изменять",
      name: "Имя",
      no: "Число",
      mint: "Мятный",
      nn: "Имя узла",
      mt: "Цена монетного двора",
      mpw: "Макс. на кошелек",
      approve: "Утвердить",
      manage: "Управлять",
      rte: "Зарегистрируйтесь, чтобы зарабатывать",
      ttr: "Всего зарегистрировано:",
      ulr: "Невостребованные награды:",
      register: "регистр",
      claim: "Требовать",
      nds: "Продажи узлов",
      finance: 'Финансы'
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "es", // Set the fallback language
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
