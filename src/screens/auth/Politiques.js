import React from "react";
import GoBack from "../../components/core/GoBack";

export default function Politiques() {
  return (
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
      <GoBack />
      {/*Container*/}
      <div className="flex w-full mx-auto h-full">
        {/*Login Form */}
        <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Container */}
          <div className="flex flex-col justify-center min-h-[60%] h-fit tall:h-[90%] w-fit min-w-[60%] tall:w-[90%] space-y-8 tall:space-y-20 p-10 dark:bg-dark_bg_2 rounded-xl">
            {/* Heading */}
            <div className="text-center dark:text-dark_text_1">
              <h2 className="text-3xl font-bold">Politique de protection des données personnelles</h2>
            </div>
            <div className="dark:text-dark_text_1">
              <div className="max-h-96 tall:max-h-[50rem] overflow-y-auto">
              <p>
                  Pour délivrer son service, JOBISSIM collecte des données à
                  caractère personnel des Utilisateurs. JOBISSIM, en tant que
                  Responsable de traitement, s’engage à respecter les
                  dispositions du règlement (UE) n°2016/679 du 27 avril 2016
                  relatif à la protection des données à caractère personnel
                  (RGPD) et de la loi n°78-17 du 6 janvier 1978 modifiée.
                </p>
                <h4 className="font-bold mt-2">
                  1. IDENTITÉ DU RESPONSABLE DE TRAITEMENT
                </h4>
                <p>
                  La société qui collecte les données à caractère personnel et
                  met en œuvre les traitements de donnée est : JOBISSIM, SAS au
                  capital de 104 606 € Immatriculée au RCS de Lille Métropole sous
                  le numéro 893 384 123 Dont le siège social se situe 35 A route nationale Ennevelin 59710, France
                </p>
                <h4 className="font-bold mt-2">
                  2. FINALITÉS DE COLLECTE DES DONNÉES ET BASES LÉGALES
                </h4>
                <p>
                  JOBISSIM est amenée à collecter et à traiter les données à
                  caractère personnel de ses clients Utilisateurs pour effectuer
                  les traitements suivants :
                </p>
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 p-2">
                        Finalité de traitement mise en œuvre par JOBISSIM
                      </th>
                      <th className="border border-gray-200 p-2">
                        Base légale
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Gestion des commandes ;
                      </td>
                      <td className="border border-gray-200 p-2">
                        Exécution du contrat passé entre un Utilisateur et
                        JOBISSIM
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Gestion des opérations de paiement ;
                      </td>
                      <td className="border border-gray-200 p-2">
                        Exécution du contrat passé entre un Utilisateur et
                        JOBISSIM
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Gestion de la relation client (téléphone / email), du
                        suivi des commandes, du service après-vente, des retours
                        produits et des remboursements ;
                      </td>
                      <td className="border border-gray-200 p-2">
                        Exécution du contrat passé entre un Utilisateur et
                        JOBISSIM
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Envoi d’offres commerciales ciblées par email, SMS, ou
                        courrier postal
                      </td>
                      <td className="border border-gray-200 p-2">
                        Consentement de l’Utilisateur ; Intérêt légitime pour
                        les envois de prospection sur support papier
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Mesure de fréquentation des sites (mobile et desktop) et de la JobiBox ;
                      </td>
                      <td className="border border-gray-200 p-2">
                        Consentement de l’Utilisateur
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 p-2">
                        Comptes utilisateurs suspendus pour manquements aux
                        Conditions Générales
                      </td>
                      <td className="border border-gray-200 p-2">
                        Exécution du contrat passé entre un Utilisateur et
                        JOBISSIM ; Intérêt légitime
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h4 className="font-bold mt-2">3. DROITS DES PERSONNES</h4>
                <h5 className="font-bold mt-2">
                  a. Quels sont les droits pouvant être exercés ?
                </h5>
                <p>
                  En application des articles 15 à 22 du règlement 2016/679 du
                  27 avril 2016, toute personne physique dont les données ont
                  été collectées a la faculté d’exercer les droits suivants :
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>Un droit d’accès</li>
                  <li>Un droit de rectification</li>
                  <li>
                    Un droit d’opposition au traitement de ses données et
                    d’effacement de ses données
                  </li>
                  <li>Un droit d’opposition au profilage</li>
                  <li>Un droit à la limitation du traitement</li>
                  <li>Un droit à la portabilité de ses données</li>
                </ul>
                <p>
                  L’Utilisateur peut également formuler des directives relatives
                  à la conservation, à l'effacement et à la communication de ses
                  données à caractère personnel après son décès conformément à
                  l’article 40-1 de la loi 78-17 du 6 janvier 1978. Ces
                  directives peuvent être générales ou particulières. Enfin,
                  l’Utilisateur a la faculté de retirer son consentement à tout
                  moment.
                </p>
                <h5 className="font-bold mt-2">b. Comment les exercer ?</h5>
                <p>
                  Ces droits peuvent être exercés auprès de la société JOBISSIM
                  qui a collecté les données à caractère personnel de la manière
                  suivante : Par voie électronique, à l’adresse :
                  jobissim@jobissim.com La demande doit indiquer, les nom,
                  prénom, email, si possible la référence client. Après
                  vérification de votre identité, JOBISSIM adresse une réponse
                  dans un délai d’un mois après l’exercice du droit. Dans
                  certains cas, liés à la complexité de la demande ou au nombre
                  de demandes, ce délai peut être prolongé de 2 mois. Ces droits
                  peuvent dans certains cas prévus par la règlementation être
                  soumis à exceptions. En cas d’absence de réponse ou de réponse
                  non satisfaisante, la personne concernée à la faculté de
                  saisir l’autorité de contrôle sur la protection des données
                  (la CNIL).
                </p>
                <h4 className="font-bold mt-2">
                  4. DURÉE DE CONSERVATION DES DONNÉES
                </h4>
                <p>
                  JOBISSIM a déterminé des règles précises concernant la durée
                  de conservation des données à caractère personnel des
                  Utilisateurs. Par principe, sauf obligation légale contraire,
                  les données sont conservées pendant la durée nécessaire à
                  l’accomplissement des finalités pour lesquelles elles ont été
                  collectées.
                </p>
                <p>Les durées de conservation retenues sont les suivantes :</p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Les données des Utilisateurs sont conservées 3 ans après la
                    dernière interaction émanant de l’Utilisateur ;
                  </li>
                  <li>
                    Les cookies de mesure d’audience se déposent sur le terminal
                    de l’Utilisateur pendant une durée de 13 mois ;
                  </li>
                  <li>Les factures d’achat sont conservées pendant 10 ans.</li>
                </ul>
                <h4 className="font-bold mt-2">5. PROSPECTION COMMERCIALE</h4>
                <p>
                  JOBISSIM utilise vos coordonnées pour vous adresser des
                  publicités ciblées notamment par email, courrier postal, sms.
                  JOBISSIM respecte les règles édictées par la directive
                  2002/58/CE du 12 juillet 2002 qui prévoit le recueil préalable
                  express du consentement de l’Utilisateur pour l’envoi de
                  prospection commerciale par voie électronique (e-mail ou SMS).
                  JOBISSIM ne vous adressera pas de sollicitations
                  personnalisées par email ou sms si vous n’y avez pas consenti.
                  Il existe une exception lorsque le Client/Utilisateur, sans
                  avoir donné son consentement préalable, peut cependant être
                  démarché dès lors qu’il est déjà client de la société JOBISSIM
                  et que l’objet de la prospection est de proposer des produits
                  ou services analogues. Dans tous les cas, le
                  client/Utilisateur a la possibilité de s’opposer à la
                  réception de ces sollicitations en effectuant les actions
                  suivantes :
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Pour l’email, en cliquant sur le lien de désabonnement prévu
                    dans chaque email ;
                  </li>
                  <li>
                    Pour le sms, en envoyant un stop SMS au numéro indiqué dans
                    celui-ci ;
                  </li>
                  <li>En contactant le service client.</li>
                </ul>
                <h4 className="font-bold mt-2">6. COOKIES, TAGS ET TRACEURS</h4>
                <h5 className="font-bold mt-2">a. Qu’est-ce qu’un cookie ?</h5>
                <p>
                  Les cookies sont de petits fichiers textes souvent cryptés qui
                  sont stockés dans le navigateur de votre ordinateur ou sur
                  votre appareil mobile lorsque vous visitez certains sites web.
                  Ils sont destinés à collecter des informations anonymes sur la
                  façon dont les utilisateurs naviguent notre site web. Les
                  cookies sont également utilisés pour connaître l'affluence et
                  ou la fréquence de visiteurs présents sur notre site afin
                  notamment de s'assurer que ce dernier fonctionne rapidement.
                  Toutefois, les données obtenues sont restreintes. Elles
                  concernent uniquement le nombre de pages visitées, la ville où
                  est localisée l’adresse IP de connexion au site web, la
                  fréquence et la récurrence des visites, la durée de la visite,
                  le navigateur, l’opérateur ou le type de terminal à partir
                  duquel la visite est effectuée. Des données telles que le nom,
                  le prénom de l’utilisateur ou l'adresse postale de connexion
                  ne sont, en aucun cas, obtenues. Les cookies n'endommagent pas
                  votre ordinateur et ne peuvent être utilisés pour vous
                  identifier personnellement. Sachez que seul l'émetteur d'un
                  cookie est susceptible de lire ou de modifier les informations
                  qui y sont contenues.
                </p>
                <h5 className="font-bold mt-2">
                  b. À quoi servent les cookies ?
                </h5>
                <p>
                  Selon vos choix (que vous pouvez modifier à tout moment), les
                  cookies que nous émettons nous permettent de vous proposer des
                  publicités ciblées, de partager du contenu sur les réseaux
                  sociaux, de mesurer l’audience du site, de conserver vos
                  informations de panier d’achat ou d’authentification, et de
                  personnaliser l'interface du site.
                </p>
                <h5 className="font-bold mt-2">
                  c. Durée de conservation des cookies
                </h5>
                <p>
                  Les cookies sont conservés pour une durée de 13 mois après
                  leur premier dépôt dans l’équipement terminal de
                  l’utilisateur.
                </p>
                <h5 className="font-bold mt-2">d. Les cookies utilisés</h5>
                <p>
                  Les cookies utilisés par JOBISSIM sont portés à la
                  connaissance de l’utilisateur du site au sein du gestionnaire
                  de consentement implémenté par JOBISSIM.
                </p>
                <h5 className="font-bold mt-2">e. Vos choix</h5>
                <p>
                  L'enregistrement d'un cookie dans un terminal est subordonné
                  au consentement de l'Utilisateur. Vous pouvez exprimer et
                  modifier à tout moment et gratuitement vos préférences en
                  matière de cookies, à travers les choix qui vous sont offerts
                  au sein du gestionnaire de consentement mis en place par
                  JOBISSIM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
