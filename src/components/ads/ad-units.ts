type AdUnit = {
  id: string;
  scriptSrc: string;
  width?: number;
  height: number;
  async?: boolean;
  containerId?: string;
  attributes?: Record<string, string>;
  atOptions?: {
    key: string;
    format: "iframe";
    height: number;
    width: number;
    params: Record<string, never>;
  };
};

export const adUnits = [
  {
    id: "container-banner",
    scriptSrc: "https://bauval.org/21/80ce3711da2ff4b5133a447334b62f1a",
    containerId: "container-80ce3711da2ff4b5133a447334b62f1a",
    height: 250,
    async: true,
    attributes: { "data-cfasync": "false" },
  },
  {
    id: "banner-320x50",
    scriptSrc: "https://bauval.org/22/4f80f2f2afe1d2b57bdce4beefa5c50c",
    width: 320,
    height: 50,
    attributes: { "data-cfasync": "false" },
    atOptions: {
      key: "4f80f2f2afe1d2b57bdce4beefa5c50c",
      format: "iframe",
      height: 50,
      width: 320,
      params: {},
    },
  },
  {
    id: "rect-300x250",
    scriptSrc: "https://bauval.org/22/24b01c01b084410df9bcc502499f3322",
    width: 300,
    height: 250,
    attributes: { "data-cfasync": "false" },
    atOptions: {
      key: "24b01c01b084410df9bcc502499f3322",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    },
  },
  {
    id: "skyscraper-160x300",
    scriptSrc: "https://bauval.org/22/5703ee8c9b38ec38101ee4cfbf0d65b4",
    width: 160,
    height: 300,
    attributes: { "data-cfasync": "false" },
    atOptions: {
      key: "5703ee8c9b38ec38101ee4cfbf0d65b4",
      format: "iframe",
      height: 300,
      width: 160,
      params: {},
    },
  },
  {
    id: "leader-468x60",
    scriptSrc: "https://bauval.org/22/aabecbb883b79020a0c4bd2d353ac898",
    width: 468,
    height: 60,
    attributes: { "data-cfasync": "false" },
    atOptions: {
      key: "aabecbb883b79020a0c4bd2d353ac898",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    },
  },
  {
    id: "leader-728x90",
    scriptSrc: "https://bauval.org/22/b8f2c010315401657d4478da8fd3cf7c",
    width: 728,
    height: 90,
    attributes: { "data-cfasync": "false" },
    atOptions: {
      key: "b8f2c010315401657d4478da8fd3cf7c",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    },
  },
] satisfies readonly AdUnit[];
