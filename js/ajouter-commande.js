const form =
    document.getElementById("formCommande");

const prixInput =
    document.getElementById("prix");

const avanceInput =
    document.getElementById("avance");

const resteElement =
    document.getElementById("reste");

const message =
    document.getElementById("message");

const btnEnregistrer =
    document.getElementById("btnEnregistrer");


// =====================================
// CALCUL DU RESTE
// =====================================

function calculerReste() {

    const prix =
        Number(prixInput.value) || 0;

    const avance =
        Number(avanceInput.value) || 0;

    const reste =
        prix - avance;


    resteElement.textContent =
        reste.toLocaleString("fr-FR")
        + " DH";


    if (reste < 0) {

        resteElement.classList.add(
            "error-text"
        );

    } else {

        resteElement.classList.remove(
            "error-text"
        );

    }

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
// ENREGISTRER
// =====================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const client =
            document.getElementById("client")
            .value
            .trim();


        const projet =
            document.getElementById("projet")
            .value
            .trim();


        const description =
            document.getElementById("description")
            .value
            .trim();


        const prix =
            Number(
                document.getElementById("prix")
                .value
            );


        const avance =
            Number(
                document.getElementById("avance")
                .value
            );


        const livraison =
            document.getElementById("livraison")
            .value;


        // Validation

        if (
            !client ||
            !projet ||
            !description ||
            !livraison
        ) {

            afficherMessage(
                "Veuillez remplir tous les champs.",
                "error"
            );

            return;

        }


        if (isNaN(prix) || prix < 0) {

            afficherMessage(
                "Le prix est invalide.",
                "error"
            );

            return;

        }


        if (
            isNaN(avance) ||
            avance < 0
        ) {

            afficherMessage(
                "L'avance est invalide.",
                "error"
            );

            return;

        }


        if (avance > prix) {

            afficherMessage(
                "L'avance ne peut pas dépasser le prix.",
                "error"
            );

            return;

        }


        btnEnregistrer.disabled =
            true;

        btnEnregistrer.textContent =
            "Enregistrement...";


        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("commandes")
                .insert({

                    client: client,

                    projet: projet,

                    description: description,

                    prix: prix,

                    avance: avance,

                    livraison: livraison

                })
                .select()
                .single();


            if (error) {

                console.error(error);

                throw error;

            }


            afficherMessage(
                "✅ Commande enregistrée.",
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
                "Erreur : " + error.message,
                "error"
            );


            btnEnregistrer.disabled =
                false;

            btnEnregistrer.textContent =
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