import { otevruConfig } from "@/config/site";

/**
 * Markup contract of the vendored form engine: `data-form` names a form id from
 * `config/forms.json`, every message is a `data-msg-*` attribute, and the
 * status paragraph gets `data-state="info|ok|error"`.
 */
export function OtevruContactForm({ privacyHref }: { privacyHref: string }) {
  return (
    <>
      <form
        className="otevru-form"
        data-form="poptavka"
        noValidate
        data-msg-sending="Odesíláme…"
        data-msg-success="Děkujeme, poptávku máme. Ozveme se vám co nejdříve."
        data-msg-error={`Formulář se nepodařilo odeslat. Zavolejte prosím na ${otevruConfig.phone}.`}
        data-msg-required="Zkontrolujte prosím zvýrazněná pole."
        data-msg-email="Zadejte platnou e-mailovou adresu."
        data-msg-tel="Zadejte platné telefonní číslo."
        data-msg-min="Tato hodnota je příliš krátká."
        data-msg-max="Tato hodnota je příliš dlouhá."
        data-msg-option="Vyberte prosím jednu z možností."
        data-msg-rate="Poptávku jste odeslali příliš mnohokrát. Zkuste to prosím později."
        data-msg-offline="Vypadá to, že jste offline. Zkontrolujte připojení a zkuste to znovu."
        data-msg-captcha="Potvrďte prosím, že nejste robot, a zkuste to znovu."
      >
        <div className="otevru-form-row">
          <label>
            <span>
              Jméno a příjmení <span aria-hidden>*</span>
            </span>
            <input
              type="text"
              name="jmeno"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
            />
          </label>
          <label>
            <span>
              Telefon <span aria-hidden>*</span>
            </span>
            <input
              type="tel"
              name="telefon"
              autoComplete="tel"
              inputMode="tel"
              required
              maxLength={40}
            />
          </label>
        </div>
        <label>
          <span>Typ poptávky</span>
          <select name="sluzba" defaultValue="Nouzové otevírání" required>
            {otevruConfig.serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>E-mail</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            maxLength={200}
          />
        </label>
        <label>
          <span>
            Co potřebujete? <span aria-hidden>*</span>
          </span>
          <textarea
            name="zprava"
            rows={5}
            required
            minLength={5}
            maxLength={4000}
            placeholder="Např. zabouchnuté dveře, výměna vložky, montáž trezoru…"
          />
        </label>
        <label className="otevru-consent">
          <input type="checkbox" name="souhlas" required />
          <span>
            Souhlasím se zpracováním osobních údajů za účelem vyřízení mé
            poptávky. Více v{" "}
            <a href={privacyHref}>zásadách ochrany osobních údajů</a>.
          </span>
        </label>
        <div data-turnstile className="otevru-turnstile" />
        <button
          type="submit"
          data-form-submit
          className="otevru-btn-blue otevru-form-submit"
        >
          Odeslat poptávku
        </button>
        <p
          className="otevru-form-status"
          data-form-status
          role="status"
          aria-live="polite"
          hidden
        />
        <p className="otevru-form-note">
          Spěchá-li to, volejte {otevruConfig.phone} — u nouzového otevírání
          voláme zpět obratem.
        </p>
      </form>
    </>
  );
}
