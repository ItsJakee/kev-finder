function calculateOptimal() {
    const cardTypeSelect = document.getElementById('cardType');
    const cardsPerPackInput = document.getElementById('cardsPerPack');
    const resultsDiv = document.getElementById('results');
    
    const multiplier = parseInt(cardTypeSelect.value);
    const cardsPerPack = parseInt(cardsPerPackInput.value);
    
    if (!cardsPerPack || cardsPerPack <= 0) {
        resultsDiv.innerHTML = `
            <div class="result-item">
                <h3>Recommendations</h3>
                <p>Select card type and enter cards per pack to see optimal sizing recommendations.</p>
            </div>
        `;
        return;
    }
    
    const cardTypeName = multiplier === 7 ? 'Poker' : 'Tarot';
    const remainder = cardsPerPack % multiplier;
    
    let recommendations = [];
    
    if (remainder === 0) {
        // Perfect fit
        recommendations.push({
            type: 'optimal',
            cards: cardsPerPack,
            action: 'Perfect fit!',
            description: `${cardsPerPack} cards fits exactly with ${cardsPerPack / multiplier} complete rows on the Kevin machine.`
        });
    } else {
        // Calculate make up to next multiple
        const makeUpTo = cardsPerPack + (multiplier - remainder);
        const makeUpDifference = makeUpTo - cardsPerPack;
        
        // Calculate drop to previous multiple
        const dropTo = cardsPerPack - remainder;
        const dropDifference = cardsPerPack - dropTo;
        
        // Add make up option
        if (makeUpDifference <= dropDifference || dropTo === 0) {
            recommendations.push({
                type: 'optimal',
                cards: makeUpTo,
                action: `Make up to ${makeUpTo}`,
                actionClass: 'make-up',
                description: `Add ${makeUpDifference} card${makeUpDifference > 1 ? 's' : ''} for ${makeUpTo / multiplier} complete rows.`
            });
            
            if (dropTo > 0) {
                recommendations.push({
                    type: 'sub-optimal',
                    cards: dropTo,
                    action: `Drop to ${dropTo}`,
                    actionClass: 'drop-to',
                    description: `Remove ${dropDifference} card${dropDifference > 1 ? 's' : ''} for ${dropTo / multiplier} complete rows.`
                });
            }
        } else {
            recommendations.push({
                type: 'optimal',
                cards: dropTo,
                action: `Drop to ${dropTo}`,
                actionClass: 'drop-to',
                description: `Remove ${dropDifference} card${dropDifference > 1 ? 's' : ''} for ${dropTo / multiplier} complete rows.`
            });
            
            recommendations.push({
                type: 'sub-optimal',
                cards: makeUpTo,
                action: `Make up to ${makeUpTo}`,
                actionClass: 'make-up',
                description: `Add ${makeUpDifference} card${makeUpDifference > 1 ? 's' : ''} for ${makeUpTo / multiplier} complete rows.`
            });
        }
    }
    
    let resultsHTML = `
        <h3>Recommendations for ${cardTypeName} (${multiplier} per row)</h3>
        <p><strong>Current:</strong> ${cardsPerPack} cards</p>
    `;
    
    recommendations.forEach(rec => {
        resultsHTML += `
            <div class="recommendation ${rec.type}">
                <strong class="action ${rec.actionClass || ''}">${rec.action}</strong>
                <p>${rec.description}</p>
            </div>
        `;
    });
    
    resultsDiv.innerHTML = resultsHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    calculateOptimal();
});