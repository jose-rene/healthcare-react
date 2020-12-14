<?php

namespace App\Http\Controllers;

use Aacotroneo\Saml2\Http\Controllers\Saml2Controller;
use Aacotroneo\Saml2\Saml2Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;

class SsoSaml2Controller extends Saml2Controller
{
    /**
     * Process an incoming saml2 assertion request.
     * Fires 'Saml2LoginEvent' event if a valid user is found.
     *
     * @param Saml2Auth $saml2Auth
     * @param $idpName
     * @return \Illuminate\Http\Response
     */
    public function acs(Saml2Auth $saml2Auth, $idpName)
    {
        $errors = $saml2Auth->acs();

        if (!empty($errors)) {
            logger()->error('Saml2 error_detail', ['error' => $saml2Auth->getLastErrorReason()]);
            session()->flash('saml2_error_detail', [$saml2Auth->getLastErrorReason()]);

            logger()->error('Saml2 error', $errors);
            session()->flash('saml2_error', $errors);

            return redirect(config('saml2_settings.errorRoute'));
        }
        $samlUser = $saml2Auth->getSaml2User();

        // event(new Saml2LoginEvent($idpName, $samlUser, $saml2Auth));

        // map microsoft azure url key attributes to entities
        $userData = [];
        foreach ($samlUser->getAttributes() as $key => $val) {
            $userData[basename($key)] = $val[0];
        }
        Log::channel('single')->info(sprintf('User %s successfully authorized.', $userData['emailaddress']));
        if (null !== ($user = User::select('id')->where('email', $userData['emailaddress'])->first()) && !empty($user)) {
            // signed url to request passport bearer token
            $url = URL::temporarySignedRoute('ssologin', now()->addMinutes(env('SSO_URL_TIMEOUT', 5)), ['email' => $userData['emailaddress']]);

            $urlInfo = parse_url($url);
            $redirect = env('FRONTEND_SSO_URL', '') . '?path=' . rawurlencode($urlInfo['path']) . '&' . $urlInfo['query'];
        } else { // this should bring up a page that reflects there's a non registered user, or send an error query string to frontend
            $redirect = '/error';
        }

        return redirect()->away($redirect);
    }
}
