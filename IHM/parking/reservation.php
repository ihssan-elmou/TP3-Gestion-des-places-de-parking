<p id="aide-selection" class="aide">Clique sur une place pour voir ses réservations et la réserver.</p>

<section id="panneau-reservation" class="panneau cache">
    <h2>Place <span id="place-numero"></span></h2>

    <h3>Réservations à venir</h3>
    <ul id="liste-reservations"></ul>

    <h3>Réserver</h3>
    <form id="form-reservation">
        <input type="hidden" id="place_id" name="place_id">

        <label for="heure_debut">Début</label>
        <input type="datetime-local" id="heure_debut" required>

        <label for="heure_fin">Fin</label>
        <input type="datetime-local" id="heure_fin" required>

        <button type="submit">Confirmer</button>
    </form>

    <p id="message-reservation" class="message"></p>
</section>