<?php foreach (($scripts ?? []) as $script): ?>
    <script src="assets/js/<?= htmlspecialchars($script) ?>"></script>
<?php endforeach; ?>
</body>
</html>