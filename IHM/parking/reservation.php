<section class="carte">
    <h2>Réserver une place</h2>

    <p id="aide-selection" class="aide">Clique sur une place pour voir ses réservations et la réserver.</p>

    <div id="panneau-reservation" class="cache">
        <p class="place-choisie">Place <strong id="place-numero"></strong></p>

        <h3>Réservations à venir</h3>
        <ul id="liste-reservations" class="liste-res"></ul>

        <form id="form-reservation">
            <input type="hidden" id="place_id" name="place_id">

            <label for="date_res">Date</label>
            <input type="date" id="date_res" required>

            <div class="deux-col">
                <div>
                    <label for="h_debut">Arrivée</label>
                    <input type="time" id="h_debut" required>
                </div>
                <div>
                    <label for="h_fin">Départ</label>
                    <input type="time" id="h_fin" required>
                </div>
            </div>

            <button type="submit" class="btn-jaune">Réserver</button>
        </form>

        <p id="message-reservation" class="message"></p>
    </div>
</section>