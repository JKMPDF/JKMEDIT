(function() {
    if (window.JKM_COOKIE_CONSENT_LOADED) return;
    window.JKM_COOKIE_CONSENT_LOADED = true;

    const COOKIE_KEY = 'jkm_cookie_consent';
    const consent = localStorage.getItem(COOKIE_KEY);
    const bannerId = 'jkm-cookie-consent-banner';

    function createBanner() {
        if (document.getElementById(bannerId)) return null;

        const style = document.createElement('style');
        style.textContent = `
            #${bannerId} {
    position: fixed;
    bottom: 10px;
    left: 10px;
    right: 10px;
    z-index: 99999;
    display: none;
    justify-content: center;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}
            #${bannerId} .jkm-cookie-box {
    width: 100%;
    max-width: 1100px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    background: rgba(18, 25, 40, 0.98);
    color: #f3f4f6;
    padding: 12px 14px;
    border-radius: 12px;
    backdrop-filter: blur(12px);
    box-shadow: 0 -8px 30px rgba(0,0,0,0.18);
}
            #${bannerId} .jkm-cookie-copy {
                flex: 1 1 320px;
                min-width: 260px;
                color: #e5e7eb;
                font-size: 14px;
                line-height: 1.5;
                max-width: 760px;
            }
            #${bannerId} .jkm-cookie-copy a {
                color: #7dd3fc;
                text-decoration: underline;
            }
            #${bannerId} .jkm-cookie-actions {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                justify-content: flex-end;
            }
            #${bannerId} .jkm-cookie-button {
                border: 1px solid transparent;
                border-radius: 999px;
                padding: 10px 18px;
                font-size: 14px;
                cursor: pointer;
                min-width: 140px;
                transition: transform 0.16s ease, background-color 0.16s ease, border-color 0.16s ease;
            }
            #${bannerId} .jkm-cookie-button:hover {
                transform: translateY(-1px);
            }
            #${bannerId} .jkm-cookie-button:focus {
                outline: 2px solid rgba(59, 130, 246, 0.6);
                outline-offset: 2px;
            }
            #${bannerId} .jkm-cookie-accept {
                background: #2563eb;
                color: white;
            }
            #${bannerId} .jkm-cookie-reject {
                background: transparent;
                color: #a0aec0;
                border-color: #475569;
            }
            @media (max-width: 680px) {

    #${bannerId} {
        bottom: 10px;
        left: 10px;
        right: 10px;
        padding: 0;
    }

    #${bannerId} .jkm-cookie-box {
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
        padding: 10px 12px;
        border-radius: 12px;
    }

    #${bannerId} .jkm-cookie-copy {
        font-size: 12px;
        line-height: 1.3;
        margin: 0;
        padding: 0;
        min-width: auto;
    }

    #${bannerId} .jkm-cookie-actions {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        margin-top: 0;
    }

    #${bannerId} .jkm-cookie-button {
        width: 100%;
        padding: 8px 10px;
        font-size: 12px;
        min-width: auto;
    }
}
        `;
        document.head.appendChild(style);

        const banner = document.createElement('div');
        banner.id = bannerId;
        banner.innerHTML = `
            <div class="jkm-cookie-box">
                <div class="jkm-cookie-copy">
                    <strong>JKM Edit uses cookies to keep this site free and working.</strong> We use essential cookies plus analytics and ads cookies only after you accept. Your file edits remain private and are processed in your browser.
                    <br><a href="https://jkmedit.in/cookie-policy.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.
<a href="https://jkmedit.in/privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy & Policy</a>.
                </div>
                <div class="jkm-cookie-actions">
                    <button type="button" class="jkm-cookie-button jkm-cookie-reject">Reject Non-Essential</button>
                    <button type="button" class="jkm-cookie-button jkm-cookie-accept">Accept All</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);
        return banner;
    }

    function setConsent(value) {
        localStorage.setItem(COOKIE_KEY, value);
        const banner = document.getElementById(bannerId);
        if (banner) banner.style.display = 'none';
    }

    function initConsent() {
        const banner = createBanner();
        if (!banner) return;
        if (consent) {
            banner.style.display = 'none';
            return;
        }

        banner.style.display = 'flex';
        const acceptBtn = banner.querySelector('.jkm-cookie-accept');
        const rejectBtn = banner.querySelector('.jkm-cookie-reject');

        acceptBtn.addEventListener('click', function() {
            setConsent('accepted');
        });
        rejectBtn.addEventListener('click', function() {
            setConsent('rejected');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConsent);
    } else {
        initConsent();
    }
})();
