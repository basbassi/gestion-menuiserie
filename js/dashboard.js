const listeCommandes =
    document.getElementById(
        "listeCommandes"
    );

const chargement =
    document.getElementById(
        "chargement"
    );

const aucuneCommande =
    document.getElementById(
        "aucuneCommande"
    );

const totalCommandes =
    document.getElementById(
        "totalCommandes"
    );

const totalPrix =
    document.getElementById(
        "totalPrix"
    );

const totalReste =
    document.getElementById(
        "totalReste"
    );


// =====================================
// CHARGER LES COMMANDES
// =====================================

async function chargerCommandes() {

    chargement.style.display =
        "block";


    aucuneCommande.style.display =
        "none";


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("commandes")
            .select("*")
            .order(
                "livraison",
                {
                    ascending: true
                }
            );


        if (error) {

            throw error;

        }


        afficherCommandes(data);


    } catch (error) {

        console.error(error);


        chargement.textContent =
            "❌ Erreur de chargement : "
            + error.message;

    }

}


// =====================================
// AFFICHER
// =====================================

function afficherCommandes(
    commandes
) {

    chargement.style.display =
        "none";


    listeCommandes.innerHTML =
        "";


    if (
        !commandes ||
        commandes.length === 0
    ) {

        aucuneCommande.style.display =
            "block";


        totalCommandes.textContent =
            "0";


        totalPrix.textContent =
            "0 DH";


        totalReste.textContent =
            "0 DH";


        return;

    }


    // Statistiques

    let prixTotal = 0;

    let resteTotal = 0;


    commandes.forEach(
        commande => {

            prixTotal +=
                Number(commande.prix);

            resteTotal +=
                Number(commande.reste);

        }
    );


    totalCommandes.textContent =
        commandes.length;


    totalPrix.textContent =
        formaterMontant(prixTotal);


    totalReste.textContent =
        formaterMontant(resteTotal);


    // Cartes

    commandes.forEach(
        commande => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "commande-card";


            const livraison =
                formaterDate(
                    commande.livraison
                );


            const reste =
                Number(
                    commande.reste
                );


            card.innerHTML = `

                <div class="commande-content">

                    <div class="commande-header">

                        <div>

                            <h3>
                                ${escapeHtml(
                                    commande.projet
                                )}
                            </h3>

                            <span class="client">
                                👤 ${escapeHtml(
                                    commande.client
                                )}
                            </span>

                        </div>

                        <div class="livraison">
                            📅 ${livraison}
                        </div>

                    </div>


                    <p class="description">

                        ${escapeHtml(
                            commande.description
                        )}

                    </p>


                    <div class="finance">

                        <div>

                            <span>
                                Prix
                            </span>

                            <strong>
                                ${formaterMontant(
                                    commande.prix
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Avance
                            </span>

                            <strong class="avance">
                                ${formaterMontant(
                                    commande.avance
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Reste
                            </span>

                            <strong class="${
                                reste > 0
                                ? "reste"
                                : "paye"
                            }">

                                ${formaterMontant(
                                    reste
                                )}

                            </strong>

                        </div>

                    </div>


                    <div class="commande-actions">

                        <a
                            href="modifier-commande.html?id=${commande.id}"
                            class="btn btn-secondary"
                        >
                            ✏️ Modifier
                        </a>


                        <button
                            class="btn btn-danger"
                            onclick="supprimerCommande(${commande.id})"
                        >
                            🗑️ Supprimer
                        </button>

                    </div>

                </div>

            `;


            listeCommandes.appendChild(
                card
            );

        }
    );

}


// =====================================
// SUPPRIMER
// =====================================

async function supprimerCommande(
    id
) {

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cette commande ?"
        );


    if (!confirmation) {
        return;
    }


    try {

        const {
            error
        } = await supabaseClient
            .from("commandes")
            .delete()
            .eq("id", id);


        if (error) {

            throw error;

        }


        await chargerCommandes();


    } catch (error) {

        console.error(error);


        alert(
            "Erreur : "
            + error.message
        );

    }

}


// =====================================
// FORMAT MONTANT
// =====================================

function formaterMontant(
    montant
) {

    return Number(
        montant
    ).toLocaleString(
        "fr-FR"
    ) + " DH";

}


// =====================================
// FORMAT DATE
// =====================================

function formaterDate(
    date
) {

    if (!date) {
        return "";
    }


    const parts =
        date.split("-");


    return (
        parts[2]
        + "/"
        + parts[1]
        + "/"
        + parts[0]
    );

}


// =====================================
// PROTECTION HTML
// =====================================

function escapeHtml(
    texte
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texte;


    return div.innerHTML;

}


// =====================================
// DÉMARRER
// =====================================

chargerCommandes();