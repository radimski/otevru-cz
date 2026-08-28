export type Operator = {
  /** Jméno podnikatele nebo obchodní firma */
  name: string;
  /** Právní forma, např. "s.r.o." — u OSVČ ponechte prázdné */
  legalForm?: string;
  address: {
    street: string;
    zip: string;
    city: string;
    country?: string;
  };
  ico: string;
  dic?: string;
  registry:
    | {
        type: "obchodni";
        court: string;
        section: string;
        insert: string;
      }
    | {
        type: "zivnostensky";
        authority?: string;
      };
  contact: {
    email: string;
    phone?: string;
  };
  /** Pověřenec pro ochranu osobních údajů — nepovinné */
  dpo?: {
    name?: string;
    email?: string;
  };
};

export type Block =
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] };

export type Section = {
  title: string;
  blocks: Block[];
};

export type LabelledValue = {
  label: string;
  value: string;
};
