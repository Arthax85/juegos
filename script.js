document.addEventListener('DOMContentLoaded', () => {
    const clickArea = document.getElementById('click-area');
    const resourcesDisplay = document.getElementById('resources');
    const levelDisplay = document.getElementById('level');
    const fragmentsDisplay = document.getElementById('fragments');
    const healthBar = document.querySelector('.health');
    const energyBar = document.querySelector('.energy');
    const experienceBar = document.querySelector('.experience');
    const combatLog = document.getElementById('combat-log');
    const attackButton = document.getElementById('attack-button');
    const specialButton = document.getElementById('special-button');
    const enemyHealthBar = document.querySelector('.enemy-health');

    let resources = 0;
    let level = 1;
    let health = 100;
    let energy = 0;
    let experience = 0;
    let fragments = 0;

    // Objetivos de enemigos
    const enemies = {
        lobo: { required: 5, defeated: 0 },
        orco: { required: 3, defeated: 0 },
        esqueleto: { required: 2, defeated: 0 }
    };

    // Misiones
    const quests = [
        { enemy: 'lobo', reward: 50, completed: false },
        { enemy: 'orco', reward: 100, completed: false },
        { enemy: 'esqueleto', reward: 150, completed: false }
    ];

    // Estado del combate
    let inCombat = false;
    let currentEnemy = null;
    let enemyHealth = 0;

    // Iniciar combate
    function startCombat(enemyType) {
        inCombat = true;
        currentEnemy = enemyType;
        enemyHealth = 50; // Salud base del enemigo
        enemyHealthBar.style.width = '100%'; // Resetear la barra de salud del enemigo
        combatLog.innerHTML = `¡Combate iniciado contra un ${enemyType}!`;
        updateCombatButtons(); // Habilitar botones de combate
    }

    // Finalizar combate
    function endCombat() {
        inCombat = false;
        currentEnemy = null;
        combatLog.innerHTML += `<br>¡Combate terminado!`;
        updateCombatButtons(); // Deshabilitar botones de combate
    }

    // Actualizar estado de los botones de combate
    function updateCombatButtons() {
        if (inCombat) {
            attackButton.disabled = false;
            specialButton.disabled = false;
        } else {
            attackButton.disabled = true;
            specialButton.disabled = true;
        }
    }

    // Ataque básico
    function attack() {
        if (!inCombat) return;

        const damage = Math.floor(Math.random() * 10) + 5; // Daño aleatorio
        enemyHealth -= damage;
        enemyHealthBar.style.width = `${(enemyHealth / 50) * 100}%`; // Actualizar barra de salud del enemigo
        combatLog.innerHTML += `<br>¡Atacas al ${currentEnemy} por ${damage} de daño!`;

        if (enemyHealth <= 0) {
            combatLog.innerHTML += `<br>¡Has derrotado al ${currentEnemy}!`;
            enemies[currentEnemy].defeated++;
            updateEnemies();
            checkQuests(); // Verificar si se completó alguna misión
            endCombat();
        } else {
            setTimeout(enemyAttack, 1000); // El enemigo ataca después de 1 segundo
        }
    }

    // Verificar misiones completadas
    function checkQuests() {
        quests.forEach((quest, index) => {
            if (!quest.completed && enemies[quest.enemy].defeated >= enemies[quest.enemy].required) {
                quest.completed = true;
                updateQuests();
            }
        });
    }

    // Ataque del enemigo
    function enemyAttack() {
        const damage = Math.floor(Math.random() * 8) + 3; // Daño aleatorio
        health -= damage;
        healthBar.style.width = `${health}%`;
        combatLog.innerHTML += `<br>¡El ${currentEnemy} te ataca por ${damage} de daño!`;

        if (health <= 0) {
            combatLog.innerHTML += `<br>¡Has sido derrotado!`;
            endCombat();
        }
    }

    // Habilidad especial
    function specialAttack() {
        if (!inCombat || energy < 50) return;

        const damage = Math.floor(Math.random() * 20) + 10; // Daño aleatorio
        enemyHealth -= damage;
        energy -= 50;
        energyBar.style.width = `${energy}%`;
        enemyHealthBar.style.width = `${(enemyHealth / 50) * 100}%`; // Actualizar barra de salud del enemigo
        combatLog.innerHTML += `<br>¡Usas una habilidad especial y haces ${damage} de daño al ${currentEnemy}!`;

        if (enemyHealth <= 0) {
            combatLog.innerHTML += `<br>¡Has derrotado al ${currentEnemy}!`;
            enemies[currentEnemy].defeated++;
            updateEnemies();
            checkQuests(); // Verificar si se completó alguna misión
            endCombat();
        } else {
            setTimeout(enemyAttack, 1000); // El enemigo ataca después de 1 segundo
        }
    }

    // Actualizar la lista de enemigos
    function updateEnemies() {
        const enemyElements = document.querySelectorAll('#enemies li');
        enemyElements.forEach(enemy => {
            const enemyType = enemy.getAttribute('data-enemy');
            const countElement = enemy.querySelector('.count');
            countElement.textContent = `(${enemies[enemyType].defeated}/${enemies[enemyType].required})`;
        });
    }

    // Actualizar la lista de misiones
    function updateQuests() {
        const questElements = document.querySelectorAll('#quests li');
        questElements.forEach((quest, index) => {
            const questStatus = quest.querySelector('.quest-status');
            if (quests[index].completed) {
                questStatus.textContent = '(Completada)';
                questStatus.classList.add('completed');
            } else {
                questStatus.textContent = '(No completada)';
                questStatus.classList.remove('completed');
            }
        });
    }

    // Clic en enemigos para iniciar combate
    document.querySelectorAll('#enemies li').forEach(enemy => {
        enemy.addEventListener('click', () => {
            const enemyType = enemy.getAttribute('data-enemy');
            if (!inCombat) {
                startCombat(enemyType);
            }
        });
    });

    // Clic en misiones para reclamar recompensas
    document.querySelectorAll('#quests li').forEach((quest, index) => {
        quest.addEventListener('click', () => {
            if (quests[index].completed) {
                resources += quests[index].reward;
                resourcesDisplay.textContent = resources;
                fragments += 1; // Recompensa de Fragmento Primigenio
                fragmentsDisplay.textContent = fragments;
                quests[index].completed = false; // Resetear la misión
                updateQuests();
            }
        });
    });

    // Clic en el área de recursos
    clickArea.addEventListener('click', () => {
        resources += level;
        resourcesDisplay.textContent = resources;

        if (resources >= level * 10) {
            level++;
            levelDisplay.textContent = level;
        }

        // Simular pérdida de vida y ganancia de experiencia
        health -= 5;
        if (health < 0) health = 100;
        healthBar.style.width = `${health}%`;

        experience += 10;
        if (experience >= 100) experience = 0;
        experienceBar.style.width = `${experience}%`;

        energy += 5;
        if (energy > 100) energy = 100;
        energyBar.style.width = `${energy}%`;
    });

    // Botones de combate
    attackButton.addEventListener('click', attack);
    specialButton.addEventListener('click', specialAttack);

    // Inicializar
    updateEnemies();
    updateQuests();
    updateCombatButtons(); // Deshabilitar botones al inicio
});