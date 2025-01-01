import '../App.css'
import { supabaseClient } from '../SupabaseClient';

export function LoggedOut() {
    async function doLogin() {
        const manifest = chrome.runtime.getManifest();
        if (!manifest) {
            return;
        }
        const url = new URL('https://accounts.google.com/o/oauth2/auth')

        url.searchParams.set('client_id', manifest?.oauth2?.client_id || "")
        url.searchParams.set('response_type', 'id_token')
        url.searchParams.set('access_type', 'offline')
        url.searchParams.set('redirect_uri', `https://${chrome.runtime.id}.chromiumapp.org`)
        url.searchParams.set('scope', manifest?.oauth2?.scopes?.join(' ') || "")
        console.log(url.href);
        chrome.identity.launchWebAuthFlow(
            {
                url: url.href,
                interactive: true,
            },
            async (redirectedTo) => {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                    // auth was not successful
                } else {
                    // auth was successful, extract the ID token from the redirectedTo URL
                    const url = new URL(redirectedTo || "");
                    const params = new URLSearchParams(url.hash.replace('#', ''));
                    console.log(redirectedTo);
                    await supabaseClient.auth.signInWithIdToken({
                        provider: 'google',
                        token: params.get('id_token') || "",
                    })
                }
            }
        )
    }
    return (
        <div className="container">
            <div className="mascot">👩‍🍳</div>
            <h1>Say goodbye to endless recipe scrolling! 🎉</h1>
            <p>Ready to transform those long-winded recipe blogs into beautiful, easy-to-follow flowcharts? Our AI-powered recipe wizard is here to help!</p>

            <div className="features">
                <p><span className="strike">Life story before the recipe</span> ➔ <span className="highlight">Clear steps</span></p>
                <p><span className="strike">Endless scrolling</span> ➔ <span className="highlight">Visual flowcharts</span></p>
                <p><span className="strike">Wall of text</span> ➔ <span className="highlight">Simple instructions</span></p>
            </div>

            <p>Just a quick login to start transforming recipes into delightfully simple flowcharts!</p>
            <button className="gsi-material-button"
            onClick={() => {
                doLogin();
            }}>
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div>
                <span className="gsi-material-button-contents">Sign in with Google</span>
                <span style={{ display: "none" }}>Sign in with Google</span>
            </div>
        </button>
            <p style={{fontSize: "0.9rem", marginTop: "1rem"}}>Powered by AI - Making recipes readable since 2024!</p>
        </div>

    )
}