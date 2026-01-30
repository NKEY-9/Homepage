/**
 * 냉장고 식자재 관리 시스템
 * 주요 기능: 문 애니메이션, 데이터 저장, 유통기한 알림, 요리 추천
 */

document.addEventListener('DOMContentLoaded', () => {
    const fridgeDoor = document.getElementById('fridgeDoor');
    const inputOverlay = document.getElementById('inputOverlay');
    const foodForm = document.getElementById('foodForm');
    const recipeSection = document.getElementById('recipeSection');
    const recipeContent = document.getElementById('recipeContent');

    // 데이터 로드
    let foods = JSON.parse(localStorage.getItem('fridge_foods')) || [];

    // 초기 애니메이션: 페이지 로드 후 1초 뒤 문 열림
    setTimeout(() => {
        openFridge();
    }, 1000);

    // 냉장고 문 열기
    const openFridge = () => {
        fridgeDoor.classList.add('open');
        setTimeout(() => {
            inputOverlay.classList.remove('hidden');
        }, 800);
    };

    // 냉장고 문 닫기
    const closeFridge = () => {
        inputOverlay.classList.add('hidden');
        setTimeout(() => {
            fridgeDoor.classList.remove('open');
        }, 500);
    };

    // 식자재 렌더링
    const renderFoods = () => {
        // 모든 슬롯 비우기
        document.querySelectorAll('.item-slot').forEach(slot => slot.innerHTML = '');

        foods.forEach((food, index) => {
            const remainingDays = calculateRemainingDays(food.expiryDate);
            const foodElement = document.createElement('div');
            foodElement.className = `food-item ${remainingDays <= 3 ? 'expiring' : ''}`;
            foodElement.innerHTML = `
        <span>${food.type}</span>
        <span>D-${remainingDays}</span>
      `;

            const slot = document.querySelector(`[data-shelf="${food.location}"], [data-rack="${food.location}"]`);
            if (slot) {
                slot.querySelector('.item-slot').appendChild(foodElement);
            }
        });

        checkExpiringItems();
    };

    // 유통기한 계산 (D-Day)
    const calculateRemainingDays = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const expiry = new Date(dateStr);
        expiry.setHours(0, 0, 0, 0);
        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // 임박 식자재 확인 및 요리 추천
    const checkExpiringItems = () => {
        const expiringItems = foods.filter(food => calculateRemainingDays(food.expiryDate) <= 3);

        if (expiringItems.length > 0) {
            recipeSection.classList.remove('hidden');
            const mainIngredient = expiringItems[0].type;
            recipeContent.innerHTML = getRecipeSuggestion(mainIngredient);
        } else {
            recipeSection.classList.add('hidden');
        }
    };

    // 자취생용 간단 요리 추천 엔진 (Mock-up)
    const getRecipeSuggestion = (ingredient) => {
        const recipes = {
            '우유': '🥛 남은 우유로 부드러운 <strong>프렌치 토스트</strong>를 만들어 보세요! (식빵, 달걀만 있으면 끝)',
            '달걀': '🥚 <strong>간장계란밥</strong> 추천! 자취생의 영원한 친구입니다.',
            '양파': '🧅 양파를 볶아 <strong>양파 덮밥</strong>을 만들어 보세요. 카라멜라이징이 핵심!',
            '두부': '🍲 <strong>두부 조림</strong>이나 <strong>두부 김치</strong>는 어떠신가요?',
            '김치': '🍳 실패 없는 <strong>김치 볶음밥</strong>을 추천합니다.',
            '대패삼겹살': '🥓 <strong>대패 숙주 볶음</strong>! 5분이면 완성됩니다.'
        };

        return recipes[ingredient] || `💡 <strong>${ingredient}</strong>을(를) 활용한 간단한 볶음 요리를 만들어 보세요!`;
    };

    // 폼 제출 이벤트
    foodForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newFood = {
            type: document.getElementById('foodType').value,
            expiryDate: document.getElementById('expiryDate').value,
            location: document.getElementById('location').value,
            alarm: document.getElementById('alarmEnabled').checked,
            id: Date.now()
        };

        foods.push(newFood);
        localStorage.setItem('fridge_foods', JSON.stringify(foods));

        renderFoods();

        // 완료 애니메이션: 폼 닫고 냉장고 닫기
        closeFridge();
    });

    // 문 클릭 시 다시 열기
    fridgeDoor.addEventListener('click', () => {
        if (!fridgeDoor.classList.contains('open')) {
            openFridge();
        }
    });

    // 초기 렌더링
    renderFoods();
});
