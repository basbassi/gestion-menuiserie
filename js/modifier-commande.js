const form =
    document.getElementById(
        "formModifier"
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get("id");


const prixInput =
    document.getElementById(
        "prix"
    );

const avanceInput =
    document.getElementById(
        "avance"
    );

const resteElement =
    document.getElementById(
        "reste"
    );

const message =
    document.getElementById(
        "message"
    );

const btnModifier =
    document.getElementById(
        "btnModifier"
    );


// =====================================
// CHARGER
// =====================================

async function chargerCommande() {

    if (!id) {

        afficherMessage(
            "Commande introuvable.",
            "error"
        );

        return;

    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("commandes")
            .select("*")
            .eq("id", id)
            .single();


        if (error) {

            throw error;

        }


        document.getElementById(
            "client"
        ).value = data.client;


        document.getElementById(
            "projet"
        ).value = data.projet;


        document.getElementById(
            "description"
        ).value = data.description;


        document.getElementById(
            "prix"
        ).value = data.prix;


        document.getElementById(
            "avance"
        ).value = data.avance;


        document.getElementById(
            "livraison"
        ).value = data.livraison;


        calculerReste();


    } catch (error) {

        console.error(error);


        afficherMessage(
            "Erreur : "
            + error.message,
            "error"
        );

    }

}


// =====================================
// CALCUL RESTE
// =====================================

function calculerReste() {

    const prix =
        Number(prixInput.value)
        || 0;


    const avance =
        Number(avanceInput.value)
        || 0;


    const reste =
        prix - avance;


    resteElement.textContent =
        reste.toLocaleString(
            "fr-FR"
        )
        + " DH";

}


prixInput.addEventListener(
    "input",
    calculerReste
);


avanceInput.addEventListener(
    "input",
    calculerReste
);


// =====================================
// MODIFIER
// =====================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const client =
            document.getElementById(
                "client"
            ).value.trim();


        const projet =
            document.getElementById(
                "projet"
            ).value.trim();


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        const prix =
            Number(
                document.getElementById(
                    "prix"
                ).value
            );


        const avance =
            Number(
                document.getElementById(
                    "avance"
                ).value
            );


        const livraison =
            document.getElementById(
                "livraison"
            ).value;


        if (
            !client ||
            !projet ||
            !description ||
            !livraison
        ) {

            afficherMessage(
                "Tous les champs sont obligatoires.",
                "error"
            );

            return;

        }


        if (
            prix < 0 ||
            avance < 0 ||
            avance > prix
        ) {

            afficherMessage(
                "Vérifiez le prix et l'avance.",
                "error"
            );

            return;

        }


        btnModifier.disabled =
            true;


        btnModifier.textContent =
            "Modification...";


        try {

            const {
                error
            } = await supabaseClient
                .from("commandes")
                .update({

                    client: client,

                    projet: projet,

                    description: description,

                    prix: prix,

                    avance: avance,

                    livraison: livraison

                })
                .eq("id", id);


            if (error) {

                throw error;

            }


            afficherMessage(
                "✅ Commande modifiée.",
                "success"
            );


            setTimeout(
                function() {

                    window.location.href =
                        "dashboard.html";

                },
                800
            );


        } catch (error) {

            console.error(error);


            afficherMessage(
                "Erreur : "
                + error.message,
                "error"
            );


            btnModifier.disabled =
                false;


            btnModifier.textContent =
                "💾 Enregistrer";

        }

    }
);


// =====================================
// MESSAGE
// =====================================

function afficherMessage(
    texte,
    type
) {

    message.textContent =
        texte;

    message.className =
        "message " + type;

}


chargerCommande();