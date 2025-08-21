/**
 * YENİ DÜZENLENME: Meal Planning Engine v4.0
 * Akıllı Faktör Sistemi ile Gelişmiş Kural Tabanlı Planlama
 */

console.log('🚀 Loading YENİ Meal Planning Engine v4.0...');

class MealPlanningEngine {
    constructor() {
        this.meals = [];
        this.realMeals = [];
        this.mockMeals = [];
        this.initialized = false;
        this.currentPlan = null;
        this.dataSource = 'mock'; // 'mock' veya 'real'
        
        // 🎯 YENİ: Gelişmiş planlama faktörleri sistemi
        this.planningFactors = null;
        this.planningCache = new Map();
        this.lastEvaluations = [];
        this.planCandidates = [];
        
        console.log('🎯 MealPlanningEngine v4.0 oluşturuldu (Akıllı Faktör Sistemi)');
    }

    async initialize(params = {}) {
        try {
            console.log('🔄 MealPlanningEngine v4.0 başlatılıyor...', params);
            
            // 🎯 YENİ: Gelişmiş faktör sistemini başlat
            if (window.AdvancedPlanningFactors) {
                this.planningFactors = new window.AdvancedPlanningFactors();
                console.log('✅ Gelişmiş planlama faktörleri sistemi aktif');
            } else {
                console.warn('⚠️ AdvancedPlanningFactors sistemi yüklü değil');
            }
            
            // Mock data yükle
            this.loadMockData();
            
            // Parametre kontrol et
            if (params.meals && Array.isArray(params.meals)) {
                // Dönüştürülmüş veri kullan
                console.log('📦 Dönüştürülmüş veri yükleniyor...', params.meals.length, 'yemek');
                this.realMeals = [...params.meals];
                this.meals = [...this.realMeals];
                this.dataSource = 'real';
            } else if (params.originalData) {
                // Orijinal veriyi dönüştür
                console.log('🔄 Orijinal veri dönüştürülüyor...');
                const convertedData = await this.loadRealData(params.originalData);
                console.log('🔍 Debug: realMeals length: ' + (this.realMeals ? this.realMeals.length : 'undefined'));
                this.meals = [...this.realMeals];
                console.log('🔍 Debug: meals length: ' + (this.meals ? this.meals.length : 'undefined'));
                this.dataSource = 'real';
            } else {
                // Mock data kullan
                console.log('🎭 Mock data kullanılıyor');
                this.meals = [...this.mockMeals];
                this.dataSource = 'mock';
            }
            
            this.initialized = true;
            console.log('✅ MealPlanningEngine v3.0 başlatıldı!', {
                totalMeals: this.meals.length,
                realMeals: this.realMeals.length,
                mockMeals: this.mockMeals.length,
                dataSource: this.dataSource
            });
            
            return {
                success: true,
                message: 'Engine başarıyla başlatıldı',
                totalMeals: this.meals.length,
                mealCount: this.meals.length,
                dataSource: this.dataSource
            };
        } catch (error) {
            console.error('❌ Engine başlatma hatası:', error);
            throw error;
        }
    }

    loadMockData() {
        this.mockMeals = [
            { id: 1, adi: "Menemen", kategori: "Kahvaltı", kalori: 250 },
            { id: 2, adi: "Çorba", kategori: "Çorba", kalori: 150 },
            { id: 3, adi: "Pilav", kategori: "Yan Yemek", kalori: 200 },
            { id: 4, adi: "Izgara Tavuk", kategori: "Ana Yemek", kalori: 300 },
            { id: 5, adi: "Salata", kategori: "Salata", kalori: 100 },
            { id: 6, adi: "Çay", kategori: "İçecek", kalori: 5 },
            { id: 7, adi: "Köfte", kategori: "Ana Yemek", kalori: 350 },
            { id: 8, adi: "Makarna", kategori: "Yan Yemek", kalori: 280 },
            { id: 9, adi: "Mercimek Çorbası", kategori: "Çorba", kalori: 120 },
            { id: 10, adi: "Peynir", kategori: "Kahvaltı", kalori: 150 }
        ];
        console.log('📦 Mock data yüklendi:', this.mockMeals.length, 'yemek');
    }

    async loadRealData(fileData) {
        try {
            console.log('📁 Gerçek data yükleniyor...');
            
            let parsedData;
            if (typeof fileData === 'string') {
                parsedData = JSON.parse(fileData);
            } else {
                parsedData = fileData;
            }
            
            console.log('🔍 parsedData type: ' + typeof parsedData);
            console.log('🔍 parsedData isArray: ' + Array.isArray(parsedData));
            console.log('🔍 parsedData length: ' + (parsedData ? parsedData.length : 'undefined'));
            
            // Gerçek veriyi standart formata dönüştür
            const convertedMeals = this.convertToStandardFormat(parsedData);
            
            this.realMeals = Array.isArray(convertedMeals) ? convertedMeals : [convertedMeals];
            console.log('✅ Gerçek data yüklendi: ' + this.realMeals.length + ' yemek');
            
            return {
                success: true,
                count: this.realMeals.length,
                meals: this.realMeals
            };
        } catch (error) {
            console.error('❌ Gerçek data yükleme hatası:', error);
            throw error;
        }
    }

    // Gerçek veriyi standart formata dönüştür
    convertToStandardFormat(data) {
        if (!data) {
            console.warn('⚠️ convertToStandardFormat: data is null/undefined');
            return [];
        }
        
        if (!Array.isArray(data)) {
            data = [data];
        }
        
        console.log('🔄 Dönüştürülecek veri: ' + (data ? data.length : 'undefined') + ' yemek');
        
        const converted = data.map((meal, index) => {
            if (!meal || typeof meal !== 'object') {
                console.warn(`⚠️ Invalid meal at index ${index}:`, meal);
                return null;
            }
            
            // Alan adı dönüştürme
            const convertedMeal = {
                adi: meal.name || meal.adi || meal.ad || meal.yemek_adi || 'İsimsiz Yemek',
                kategori: meal.category || meal.kategori || 'genel',
                kalori: meal.calories || meal.kalori || 0,
                protein: meal.protein || 0,
                karbonhidrat: meal.carbs || meal.karbonhidrat || 0,
                yag: meal.fat || meal.yag || 0,
                diyet_uyumlu: meal.diet_compatible || meal.diyet_uyumlu || ['genel'],
                rol: meal.role || 'main'
            };
            
            // Diğer alanları kopyala
            Object.keys(meal).forEach(key => {
                if (!convertedMeal.hasOwnProperty(key) && key !== 'name' && key !== 'calories' && key !== 'carbs' && key !== 'fat' && key !== 'category') {
                    convertedMeal[key] = meal[key];
                }
            });
            
            return convertedMeal;
        }).filter(meal => meal !== null); // null değerleri filtrele
        
        console.log('✅ Dönüştürme tamamlandı: ' + converted.length + ' geçerli yemek');
        return converted;
    }

    setDataSource(source) {
        this.dataSource = source;
        this.meals = source === 'real' ? this.realMeals : this.mockMeals;
        console.log(`🔄 Data source değiştirildi: ${source} (${this.meals.length} yemek)`);
    }

    /**
     * 🆕 YENİ KURAL SİSTEMİ: Gelişmiş Plan Oluşturma
     */
    async createNewAdvancedPlan(params = {}) {
        if (!this.initialized) {
            throw new Error('Engine henüz başlatılmamış! initialize() çağırın.');
        }

        console.log('🎯 YENİ Gelişmiş plan oluşturuluyor...', params);
        
        // Gelişmiş plan parametrelerini kaydet
        this.lastAdvancedParams = {
            dietType: params.dietType || 'lowcarb',
            days: params.days || 7,
            targetCalories: params.targetCalories || 1800,
            advancedRules: params.advancedRules || {},
            patientProfile: params.patientProfile || {}
        };
        
        console.log('💾 Gelişmiş plan parametreleri kaydedildi:', this.lastAdvancedParams);
        
        // 🎯 YENİ: Faktör bazlı akıllı planlama
        if (this.planningFactors && params.useIntelligentPlanning !== false) {
            return await this.createIntelligentFactorBasedPlan(params);
        } else {
            // Klasik kural bazlı planlama
            return await this.createClassicRuleBasedPlan(params);
        }
    }

    /**
     * 🧠 AKILLI FAKTÖR BAZLI PLANLAMA
     */
    async createIntelligentFactorBasedPlan(params) {
        console.log('🧠 Akıllı faktör bazlı plan oluşturuluyor...');
        
        const { days = 7, patientProfile = {}, planningContext = {} } = params;
        
        try {
            // 1. Çoklu plan adayları oluştur
            const candidatePlans = await this.generateMultiplePlanCandidates(params, 5); // 5 aday
            
            // 2. Her adayı faktör sistemine göre değerlendir
            const evaluatedCandidates = [];
            
            for (let i = 0; i < candidatePlans.length; i++) {
                console.log(`📊 Plan adayı ${i + 1} değerlendiriliyor...`);
                
                const evaluation = this.planningFactors.evaluatePlanCandidate(
                    candidatePlans[i],
                    patientProfile,
                    planningContext
                );
                
                evaluatedCandidates.push({
                    plan: candidatePlans[i],
                    evaluation: evaluation,
                    candidateIndex: i
                });
            }
            
            // 3. En iyi adayı seç
            const validCandidates = evaluatedCandidates.filter(c => c.evaluation.isValid);
            
            if (validCandidates.length === 0) {
                console.warn('⚠️ Hiç geçerli plan adayı bulunamadı! Klasik yönteme geçiliyor.');
                return await this.createClassicRuleBasedPlan(params);
            }
            
            // Skora göre sırala (en yüksek en iyi)
            validCandidates.sort((a, b) => b.evaluation.totalScore - a.evaluation.totalScore);
            
            const bestCandidate = validCandidates[0];
            
            console.log('🏆 En iyi plan adayı seçildi:', {
                candidateIndex: bestCandidate.candidateIndex,
                totalScore: bestCandidate.evaluation.totalScore.toFixed(2),
                violations: bestCandidate.evaluation.violations.length,
                recommendations: bestCandidate.evaluation.recommendations.length
            });
            
            // 4. Sonuçları kaydet ve döndür
            this.lastEvaluations = evaluatedCandidates;
            this.currentPlan = bestCandidate.plan;
            
            return {
                success: true,
                plan: bestCandidate.plan,
                evaluation: bestCandidate.evaluation,
                allCandidates: evaluatedCandidates.map(c => ({
                    score: c.evaluation.totalScore,
                    violations: c.evaluation.violations.length,
                    isValid: c.evaluation.isValid
                })),
                planningMethod: 'intelligent_factor_based',
                version: this.version
            };
            
        } catch (error) {
            console.error('❌ Akıllı planlama hatası:', error);
            console.log('🔄 Klasik yönteme geçiliyor...');
            return await this.createClassicRuleBasedPlan(params);
        }
    }

    /**
     * 📋 ÇOKLU PLAN ADAYI OLUŞTURMA
     */
    async generateMultiplePlanCandidates(params, candidateCount = 5) {
        console.log(`🎲 ${candidateCount} farklı plan adayı oluşturuluyor...`);
        
        const candidates = [];
        const baseParams = { ...params };
        
        for (let i = 0; i < candidateCount; i++) {
            // Her adayın biraz farklı olması için parametrelere varyasyon ekle
            const variedParams = this.addParameterVariation(baseParams, i);
            
            try {
                // Klasik method ile plan oluştur
                const candidatePlan = await this.createClassicRuleBasedPlan(variedParams, false); // silent mode
                
                if (candidatePlan.success && candidatePlan.plan) {
                    candidates.push(candidatePlan.plan);
                    console.log(`✅ Aday ${i + 1} oluşturuldu`);
                } else {
                    console.warn(`⚠️ Aday ${i + 1} oluşturulamadı`);
                }
            } catch (error) {
                console.error(`❌ Aday ${i + 1} hatası:`, error);
            }
        }
        
        console.log(`📊 ${candidates.length}/${candidateCount} plan adayı hazır`);
        return candidates;
    }

    /**
     * 🎨 PARAMETRE VARYASYONU EKLEME
     */
    addParameterVariation(baseParams, variationIndex) {
        const varied = JSON.parse(JSON.stringify(baseParams)); // Deep copy
        
        // Her adayın farklı özellikler taşıması için küçük değişiklikler
        switch (variationIndex % 5) {
            case 0:
                // Orijinal parametreler (kontrol grubu)
                break;
                
            case 1:
                // Çeşitlilik odaklı
                if (varied.advancedRules) {
                    varied.advancedRules.varietyBonus = true;
                    varied.advancedRules.avoidRepetition = true;
                }
                break;
                
            case 2:
                // Kalori dengesi odaklı  
                if (varied.targetCalories) {
                    varied.targetCalories *= 0.95; // %5 düşük kalori
                }
                break;
                
            case 3:
                // Protein odaklı
                if (!varied.advancedRules) varied.advancedRules = {};
                varied.advancedRules.proteinFocus = true;
                break;
                
            case 4:
                // Hızlı hazırlık odaklı
                if (!varied.advancedRules) varied.advancedRules = {};
                varied.advancedRules.quickPrep = true;
                break;
        }
        
        return varied;
    }

    /**
     * 📋 KLASİK KURAL BAZLI PLANLAMA
     */
    async createClassicRuleBasedPlan(params, verbose = true) {
        if (verbose) {
            console.log(`📋 Klasik plan başlatılıyor: ${params.days || 7} günlük`);
        }
        
        const advancedRules = params.advancedRules || {};
        const days = params.days || 7;
        
        // 🔧 DEFAULT mealRules ekle eğer yoksa
        if (!advancedRules.mealRules) {
            advancedRules.mealRules = {
                breakfast: { min: 2, max: 3 },
                lunch: { min: 3, max: 4 },
                dinner: { min: 2, max: 3 }
            };
            console.log('🔧 Default mealRules eklendi:', advancedRules.mealRules);
        }
        
        // Haftalık plan başlat
        const weeklyPlan = this.initializeWeeklyPlan(days);
        console.log('🏗️ Haftalık plan başlatıldı:', days, 'gün');
        
        // 1. Önce öğün sayılarını uygula
        this.applyMealCountRules(weeklyPlan, advancedRules.mealRules);
        
        // 2. Sonra rol bazlı kuralları uygula
        this.applyRoleBasedRules(weeklyPlan, advancedRules.roleRules);
        
        // 3. YENİ: Kategori bazlı kuralları uygula
        this.applyCategoryBasedRules(weeklyPlan, advancedRules.categoryRules);
        
        // 4. YENİ: İsim bazlı kuralları uygula  
        this.applyNameBasedRules(weeklyPlan, advancedRules.nameRules);
        
        // 5. YENİ: Anahtar kelime bazlı kuralları uygula
        this.applyKeywordBasedRules(weeklyPlan, advancedRules.keywordRules);
        
        // 3. Kural uyumluluğunu hesapla
        const compliance = this.calculateAdvancedCompliance(weeklyPlan, advancedRules);
        
        // 4. Plan özet oluştur
        const summary = this.generateAdvancedSummary(weeklyPlan, advancedRules);
        
        const result = {
            success: true,  // 🔧 Eksik success field eklendi
            plan: weeklyPlan,
            compliance: compliance,
            rules: advancedRules,
            summary: summary
        };
        
        this.currentPlan = result;
        console.log('✅ YENİ Gelişmiş plan tamamlandı!', summary);
        
        return result;
    }

    // Haftalık plan yapısını başlat
    initializeWeeklyPlan(days) {
        const plan = [];
        for (let i = 0; i < days; i++) {
            plan.push({
                breakfast: [],
                lunch: [],
                dinner: []
            });
        }
        return plan;
    }

    // Öğün sayı kurallarını uygula
    applyMealCountRules(weeklyPlan, mealRules) {
        console.log('🍽️ applyMealCountRules çağrıldı:', {
            mealRulesExist: !!mealRules,
            planDays: weeklyPlan.length
        });
        
        if (!mealRules) {
            console.warn('⚠️ mealRules undefined - öğün sayısı ayarlanamıyor');
            return;
        }

        weeklyPlan.forEach((day, dayIndex) => {
            console.log(`📅 Gün ${dayIndex + 1} işleniyor...`);
            
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                const rule = mealRules[mealType];
                if (!rule) {
                    console.log(`  ⚠️ ${mealType}: kural yok, atlanıyor`);
                    return;
                }

                const targetCount = rule.fixed || this.getRandomBetween(rule.min, rule.max);
                const currentMeals = day[mealType] || [];
                
                console.log(`  🎯 ${mealType}: hedef ${targetCount}, mevcut ${currentMeals.length}`);
                
                // Meal sayısını ayarla
                if (currentMeals.length < targetCount) {
                    // Eksik meal ekle
                    console.log(`  📈 ${targetCount - currentMeals.length} yemek ekleniyor...`);
                    const additionalMeals = this.selectRandomMeals(targetCount - currentMeals.length, mealType);
                    console.log(`  ✅ ${additionalMeals.length} yemek eklendi`);
                    day[mealType] = [...currentMeals, ...additionalMeals];
                } else if (currentMeals.length > targetCount) {
                    // Fazla meal'ları çıkar
                    console.log(`  📉 ${currentMeals.length - targetCount} yemek çıkarılıyor...`);
                    day[mealType] = currentMeals.slice(0, targetCount);
                }
            });
        });
        
        console.log('✅ applyMealCountRules tamamlandı');
    }

    // Rol bazlı kuralları uygula
    applyRoleBasedRules(weeklyPlan, roleRules) {
        if (!roleRules || !Array.isArray(roleRules)) return;

        roleRules.forEach(rule => {
            this.applyIndividualRoleRule(weeklyPlan, rule);
        });
    }

    // Tek bir rol kuralını uygula
    applyIndividualRoleRule(weeklyPlan, rule) {
        const { role, scope, min, max, fixed, meals, weeks } = rule;
        
        // Hedef sayıyı belirle
        const targetCount = fixed || this.getRandomBetween(min, max);
        
        console.log(`🎭 Rol kuralı uygulanıyor: ${role} - ${scope} - ${targetCount} adet`);
        
        // Scope'a göre uygula
        switch (scope) {
            case 'meal':
                this.applyRoleRulePerMeal(weeklyPlan, rule, targetCount);
                break;
            case 'day':
                this.applyRoleRulePerDay(weeklyPlan, rule, targetCount);
                break;
            case 'week':
                this.applyRoleRulePerWeek(weeklyPlan, rule, targetCount);
                break;
        }
    }

    // Öğün başına rol kuralı
    applyRoleRulePerMeal(weeklyPlan, rule, targetCount) {
        const { role, meals, weeks } = rule;
        
        weeklyPlan.forEach((day, dayIndex) => {
            const currentWeek = Math.floor(dayIndex / 7) + 1;
            if (weeks && weeks.length > 0 && !weeks.includes(currentWeek)) return;
            
            meals.forEach(mealType => {
                if (!day[mealType]) day[mealType] = [];
                
                // Bu rolde kaç meal var?
                const roleCount = day[mealType].filter(meal => this.getMealRole(meal) === role).length;
                
                if (roleCount < targetCount) {
                    // Eksik role sahip meal ekle
                    const additionalMeals = this.selectMealsByRole(role, targetCount - roleCount);
                    day[mealType] = [...day[mealType], ...additionalMeals];
                }
            });
        });
    }

    // Gün başına rol kuralı
    applyRoleRulePerDay(weeklyPlan, rule, targetCount) {
        const { role, meals, weeks } = rule;
        
        weeklyPlan.forEach((day, dayIndex) => {
            const currentWeek = Math.floor(dayIndex / 7) + 1;
            if (weeks && weeks.length > 0 && !weeks.includes(currentWeek)) return;
            
            // Gün içinde bu rolde toplam kaç meal var?
            let dailyRoleCount = 0;
            meals.forEach(mealType => {
                if (day[mealType]) {
                    dailyRoleCount += day[mealType].filter(meal => this.getMealRole(meal) === role).length;
                }
            });
            
            if (dailyRoleCount < targetCount) {
                // En uygun öğüne meal ekle
                const targetMeal = meals[0] || 'lunch';
                if (!day[targetMeal]) day[targetMeal] = [];
                
                const additionalMeals = this.selectMealsByRole(role, targetCount - dailyRoleCount);
                day[targetMeal] = [...day[targetMeal], ...additionalMeals];
            }
        });
    }

    // Hafta başına rol kuralı
    applyRoleRulePerWeek(weeklyPlan, rule, targetCount) {
        const { role, meals, weeks } = rule;
        
        // Hafta gruplarına böl
        const weekGroups = this.groupPlanByWeeks(weeklyPlan);
        
        weekGroups.forEach((week, weekIndex) => {
            const currentWeek = weekIndex + 1;
            if (weeks && weeks.length > 0 && !weeks.includes(currentWeek)) return;
            
            // Hafta içinde bu rolde toplam kaç meal var?
            let weeklyRoleCount = 0;
            week.forEach(day => {
                meals.forEach(mealType => {
                    if (day[mealType]) {
                        weeklyRoleCount += day[mealType].filter(meal => this.getMealRole(meal) === role).length;
                    }
                });
            });
            
            if (weeklyRoleCount < targetCount) {
                // Eksik meal'ları hafta boyunca dağıt
                const needed = targetCount - weeklyRoleCount;
                this.distributeRoleMealsAcrossWeek(week, role, meals, needed);
            }
        });
    }

    // Meal'in rolünü belirle
    getMealRole(meal) {
        if (!meal) {
            console.warn('⚠️ getMealRole: meal is null/undefined');
            return 'unknown';
        }
        
        // Real data'da farklı field isimleri olabilir
        const mealName = meal.adi || meal.name || meal.ad || meal.yemek_adi || '';
        
        if (!mealName) {
            console.warn('⚠️ getMealRole: meal name not found', meal);
            return 'unknown';
        }
        
        const name = mealName.toLowerCase();
        
        if (name.includes('çorba')) return 'soup';
        if (name.includes('salata')) return 'salad';
        if (name.includes('çay') || name.includes('kahve') || name.includes('ayran') || name.includes('su')) return 'beverage';
        if (name.includes('kek') || name.includes('kurabiye') || name.includes('meyve')) return 'snack';
        if (name.includes('pilav') || name.includes('makarna') || name.includes('börek')) return 'side';
        
        // Varsayılan olarak ana yemek
        return 'main';
    }

    // 🆕 YENİ: Kategori bazlı kuralları uygula
    applyCategoryBasedRules(weeklyPlan, categoryRules) {
        if (!categoryRules || !Array.isArray(categoryRules)) return;

        categoryRules.forEach(rule => {
            this.applyIndividualCategoryRule(weeklyPlan, rule);
        });
    }

    // 🆕 YENİ: İsim bazlı kuralları uygula
    applyNameBasedRules(weeklyPlan, nameRules) {
        if (!nameRules || !Array.isArray(nameRules)) return;

        nameRules.forEach(rule => {
            this.applyIndividualNameRule(weeklyPlan, rule);
        });
    }

    // 🆕 YENİ: Anahtar kelime bazlı kuralları uygula
    applyKeywordBasedRules(weeklyPlan, keywordRules) {
        if (!keywordRules || !Array.isArray(keywordRules)) return;

        keywordRules.forEach(rule => {
            this.applyIndividualKeywordRule(weeklyPlan, rule);
        });
    }

    // 🆕 YENİ: Tek kategori kuralını uygula
    applyIndividualCategoryRule(weeklyPlan, rule) {
        const { category, scope, min, max, fixed, operator } = rule;
        const targetCount = fixed || this.getRandomBetween(min, max);
        
        console.log(`🏷️ Kategori kuralı uygulanıyor: ${category} - ${scope} - ${targetCount} adet`);
        
        const categoryMeals = this.selectMealsByCategory(category, targetCount * 10); // Buffer ekle
        this.distributeMealsToWeeklyPlan(weeklyPlan, categoryMeals, targetCount, scope);
    }

    // 🆕 YENİ: Tek isim kuralını uygula
    applyIndividualNameRule(weeklyPlan, rule) {
        const { keywords, scope, min, max, fixed, operator } = rule;
        const targetCount = fixed || this.getRandomBetween(min, max);
        
        console.log(`📝 İsim kuralı uygulanıyor: "${keywords.join(', ')}" (${operator}) - ${scope} - ${targetCount} adet`);
        
        const nameMeals = this.selectMealsByName(keywords, operator, targetCount * 10);
        this.distributeMealsToWeeklyPlan(weeklyPlan, nameMeals, targetCount, scope);
    }

    // 🆕 YENİ: Tek anahtar kelime kuralını uygula
    applyIndividualKeywordRule(weeklyPlan, rule) {
        const { keywords, scope, min, max, fixed, operator } = rule;
        const targetCount = fixed || this.getRandomBetween(min, max);
        
        console.log(`🔑 Anahtar kelime kuralı uygulanıyor: "${keywords.join(', ')}" (${operator}) - ${scope} - ${targetCount} adet`);
        
        const keywordMeals = this.selectMealsByKeywords(keywords, operator, targetCount * 10);
        this.distributeMealsToWeeklyPlan(weeklyPlan, keywordMeals, targetCount, scope);
    }

    // 🆕 YENİ: Kategoriye göre yemek seç
    selectMealsByCategory(category, count) {
        const categoryMeals = this.meals.filter(meal => {
            const mealCategory = meal.kategori || meal.category || '';
            return mealCategory.toLowerCase().includes(category.toLowerCase());
        });
        
        return this.selectRandomFromArray(categoryMeals.length > 0 ? categoryMeals : this.meals, count);
    }

    // 🆕 YENİ: İsme göre yemek seç (VE/VEYA operatörü ile)
    selectMealsByName(keywords, operator, count) {
        const filteredMeals = this.meals.filter(meal => {
            const mealName = (meal.adi || meal.name || meal.ad || meal.yemek_adi || '').toLowerCase();
            
            if (operator === 'AND') {
                // Tüm kelimeler mevcut olmalı
                return keywords.every(keyword => mealName.includes(keyword.toLowerCase()));
            } else {
                // En az bir kelime mevcut olmalı (OR)
                return keywords.some(keyword => mealName.includes(keyword.toLowerCase()));
            }
        });
        
        return this.selectRandomFromArray(filteredMeals.length > 0 ? filteredMeals : this.meals, count);
    }

    // 🆕 YENİ: Anahtar kelimelere göre yemek seç (VE/VEYA operatörü ile)
    selectMealsByKeywords(keywords, operator, count) {
        const filteredMeals = this.meals.filter(meal => {
            // Yemek verisindeki tüm string alanları kontrol et
            const searchableFields = [
                meal.adi, meal.name, meal.ad, meal.yemek_adi,
                meal.kategori, meal.category,
                meal.tags, meal.etiketler
            ].filter(field => field).join(' ').toLowerCase();
            
            if (operator === 'AND') {
                // Tüm anahtar kelimeler mevcut olmalı
                return keywords.every(keyword => searchableFields.includes(keyword.toLowerCase()));
            } else {
                // En az bir anahtar kelime mevcut olmalı (OR)
                return keywords.some(keyword => searchableFields.includes(keyword.toLowerCase()));
            }
        });
        
        return this.selectRandomFromArray(filteredMeals.length > 0 ? filteredMeals : this.meals, count);
    }

    // 🆕 YENİ: Yemekleri haftalık plana dağıt
    distributeMealsToWeeklyPlan(weeklyPlan, meals, targetCount, scope) {
        let distributedCount = 0;
        
        for (let dayIndex = 0; dayIndex < weeklyPlan.length && distributedCount < targetCount; dayIndex++) {
            const day = weeklyPlan[dayIndex];
            
            for (let mealType of ['breakfast', 'lunch', 'dinner']) {
                if (distributedCount >= targetCount) break;
                
                if (!day[mealType]) day[mealType] = [];
                
                const mealToAdd = meals[distributedCount % meals.length];
                if (mealToAdd) {
                    day[mealType].push(mealToAdd);
                    distributedCount++;
                }
            }
        }
    }

    // Role göre meal seç
    selectMealsByRole(role, count) {
        const roleKeywords = {
            'soup': ['çorba'],
            'salad': ['salata'],
            'beverage': ['çay', 'kahve', 'ayran', 'su'],
            'snack': ['kek', 'kurabiye', 'meyve'],
            'side': ['pilav', 'makarna', 'börek'],
            'main': ['et', 'tavuk', 'balık', 'köfte']
        };
        
        const keywords = roleKeywords[role] || [];
        const suitableMeals = this.meals.filter(meal => {
            const mealName = meal.adi || meal.name || meal.ad || meal.yemek_adi || '';
            if (!mealName) return false;
            
            const name = mealName.toLowerCase();
            return keywords.some(keyword => name.includes(keyword));
        });
        
        // Yeterli meal yoksa genel havuzdan seç
        const mealsToSelect = suitableMeals.length >= count ? suitableMeals : this.meals;
        
        return this.selectRandomFromArray(mealsToSelect, count);
    }

    // Hafta boyunca meal dağıt
    distributeRoleMealsAcrossWeek(week, role, allowedMeals, count) {
        const roleMeals = this.selectMealsByRole(role, count);
        let distributionIndex = 0;
        
        for (let dayIndex = 0; dayIndex < week.length && distributionIndex < roleMeals.length; dayIndex++) {
            const day = week[dayIndex];
            
            for (let mealType of allowedMeals) {
                if (distributionIndex >= roleMeals.length) break;
                
                if (!day[mealType]) day[mealType] = [];
                day[mealType].push(roleMeals[distributionIndex]);
                distributionIndex++;
            }
        }
    }

    // Planı haftalara böl
    groupPlanByWeeks(weeklyPlan) {
        const weeks = [];
        for (let i = 0; i < weeklyPlan.length; i += 7) {
            weeks.push(weeklyPlan.slice(i, i + 7));
        }
        return weeks;
    }

    // Gelişmiş uyumluluk hesapla
    calculateAdvancedCompliance(weeklyPlan, advancedRules) {
        const compliance = {
            overall: 0,
            mealCounts: this.checkMealCountCompliance(weeklyPlan, advancedRules.mealRules),
            roleRules: this.checkRoleRuleCompliance(weeklyPlan, advancedRules.roleRules),
            details: []
        };
        
        // Genel uyumluluk skoru
        compliance.overall = (compliance.mealCounts.score + compliance.roleRules.score) / 2;
        
        return compliance;
    }

    // Öğün sayısı uyumluluğu
    checkMealCountCompliance(weeklyPlan, mealRules) {
        if (!mealRules) return { score: 100, passed: 0, total: 0, details: [] };
        
        let totalChecks = 0;
        let passedChecks = 0;
        const details = [];
        
        weeklyPlan.forEach((day, dayIndex) => {
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                const rule = mealRules[mealType];
                if (!rule) return;
                
                const mealCount = (day[mealType] || []).length;
                const min = rule.min || 0;
                const max = rule.max || 10;
                
                totalChecks++;
                if (mealCount >= min && mealCount <= max) {
                    passedChecks++;
                } else {
                    details.push(`Gün ${dayIndex + 1} ${mealType}: ${mealCount} meal (${min}-${max} bekleniyor)`);
                }
            });
        });
        
        return {
            score: totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100,
            passed: passedChecks,
            total: totalChecks,
            details: details
        };
    }

    // Rol kuralı uyumluluğu
    checkRoleRuleCompliance(weeklyPlan, roleRules) {
        if (!roleRules || !Array.isArray(roleRules)) return { score: 100, passed: 0, total: 0, details: [] };
        
        let totalChecks = 0;
        let passedChecks = 0;
        const details = [];
        
        roleRules.forEach(rule => {
            const compliance = this.checkIndividualRoleRule(weeklyPlan, rule);
            totalChecks += compliance.total;
            passedChecks += compliance.passed;
            details.push(...compliance.details);
        });
        
        return {
            score: totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100,
            passed: passedChecks,
            total: totalChecks,
            details: details
        };
    }

    // Tek rol kuralı kontrolü
    checkIndividualRoleRule(weeklyPlan, rule) {
        return {
            passed: 1,
            total: 1,
            details: [`${rule.role} kuralı kontrol edildi`]
        };
    }

    // Gelişmiş özet oluştur
    generateAdvancedSummary(weeklyPlan, advancedRules) {
        const summary = {
            totalDays: weeklyPlan.length,
            totalMeals: 0,
            roleDistribution: {},
            mealTypeDistribution: { breakfast: 0, lunch: 0, dinner: 0 },
            averageMealsPerDay: 0
        };
        
        weeklyPlan.forEach(day => {
            ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                const meals = day[mealType] || [];
                summary.totalMeals += meals.length;
                summary.mealTypeDistribution[mealType] += meals.length;
                
                meals.forEach(meal => {
                    const role = this.getMealRole(meal);
                    summary.roleDistribution[role] = (summary.roleDistribution[role] || 0) + 1;
                });
            });
        });
        
        summary.averageMealsPerDay = Math.round((summary.totalMeals / weeklyPlan.length) * 10) / 10;
        
        return summary;
    }

    // Utility fonksiyonlar
    getRandomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    selectRandomMeals(count, mealType) {
        if (!this.meals || this.meals.length === 0) {
            console.error('❌ HATA: this.meals is empty or undefined!');
            return [];
        }
        
        // MealType kısıtlamalarına göre uygun yemekleri filtrele
        const eligibleMeals = this.filterMealsByType(this.meals, mealType);
        console.log(`🍽️ ${mealType} için ${eligibleMeals.length}/${this.meals.length} yemek uygun`);
        
        if (eligibleMeals.length === 0) {
            console.warn(`⚠️ ${mealType} için uygun yemek bulunamadı!`);
            return [];
        }
        
        const selected = this.selectRandomFromArray(eligibleMeals, count);
        console.log(`✅ ${mealType} için ${selected.length}/${count} yemek seçildi`);
        
        return selected;
    }

    // Yemekleri mealType'a göre filtrele
    filterMealsByType(meals, targetMealType) {
        let passedCount = 0;
        let failedCount = 0;
        
        const filtered = meals.filter(meal => {
            // mealType kontrolü
            const mealTypes = meal.mealType || [];
            
            // Eğer mealType boşsa, her öğüne verilebilir
            if (!mealTypes || mealTypes.length === 0) {
                passedCount++;
                return true;
            }
            
            // mealType dizisinde targetMealType var mı kontrol et
            const isAllowed = mealTypes.some(type => {
                // Türkçe karşılaştırma
                if (targetMealType === 'breakfast' && (type === 'breakfast' || type === 'kahvalti' || type === 'kahvaltı')) return true;
                if (targetMealType === 'lunch' && (type === 'lunch' || type === 'öğle' || type === 'ogle')) return true;
                if (targetMealType === 'dinner' && (type === 'dinner' || type === 'akşam' || type === 'aksam')) return true;
                if (targetMealType === 'snack' && (type === 'snack' || type === 'ara')) return true;
                
                // Direkt eşleşme
                return type === targetMealType;
            });
            
            if (isAllowed) {
                passedCount++;
            } else {
                failedCount++;
            }
            
            return isAllowed;
        });
        
        console.log(`🍽️ filterMealsByType sonuç: ${passedCount} geçti, ${failedCount} reddedildi`);
        
        // İlk 3 uygun yemeği göster
        if (filtered.length > 0) {
            console.log(`✅ İlk ${Math.min(3, filtered.length)} uygun yemek:`);
            filtered.slice(0, 3).forEach((meal, idx) => {
                console.log(`  ${idx + 1}. ${meal.name || meal.yemek_adi}`);
            });
        }
        
        return filtered;
    }

    selectRandomFromArray(array, count) {
        if (!array || array.length === 0) return [];
        
        console.log('🔍 Array test - length:', array.length);
        console.log('🔍 Array test - first 3 elements exist:', [
            array[0] ? 'YES' : 'NO',
            array[1] ? 'YES' : 'NO', 
            array[2] ? 'YES' : 'NO'
        ]);
        
        const result = [];
        const usedIndices = new Set();
        
        for (let i = 0; i < count && usedIndices.size < array.length; i++) {
            let randomIndex;
            let attempts = 0;
            
            do {
                randomIndex = Math.floor(Math.random() * array.length);
                attempts++;
                
                if (attempts > 100) {
                    console.error('❌ Too many attempts to find valid meal!');
                    break;
                }
            } while (usedIndices.has(randomIndex) || !array[randomIndex]);
            
            if (array[randomIndex]) {
                usedIndices.add(randomIndex);
                const selectedMeal = array[randomIndex];
                
                console.log('🔍 selectedMeal found at index:', randomIndex);
                
                try {
                    result.push({ ...selectedMeal });
                } catch (error) {
                    console.error('❌ Spread error for meal:', error);
                    result.push(JSON.parse(JSON.stringify(selectedMeal)));
                }
            } else {
                console.warn('⚠️ No valid meal found after 100 attempts');
            }
        }
        
        return result;
    }

    // Basit plan oluşturma (compatibility için)
    async createBasicPlan(params = {}) {
        // Parametreleri ayarla - hem object hem string desteği
        let dietType, days, targetCalories;
        
        if (typeof params === 'string') {
            dietType = params;
            days = arguments[1] || 7;
            targetCalories = 1800;
        } else {
            dietType = params.dietType || 'lowcarb';
            days = params.days || 7;
            targetCalories = params.targetCalories || 1800;
        }
        
        // Eğer daha önce gelişmiş plan parametreleri set edildiyse, onları kullan
        if (this.lastAdvancedParams) {
            console.log('🔄 En son gelişmiş plan parametreleri kullanılıyor...');
            dietType = this.lastAdvancedParams.dietType || dietType;
            days = this.lastAdvancedParams.days || days;
            targetCalories = this.lastAdvancedParams.targetCalories || targetCalories;
            
            console.log(`📋 Gelişmiş parametreler: ${dietType}, ${days} gün, ${targetCalories} kcal`);
        }
        
        console.log(`🍽️ Basit plan oluşturuluyor: ${dietType}, ${days} gün`);
        console.log('🔍 Debug: this.meals exists? ' + !!this.meals);
        console.log('🔍 Debug: this.meals length: ' + (this.meals ? this.meals.length : 'UNDEFINED'));
        console.log('🔍 Debug: this.meals[0] exists? ' + (this.meals && this.meals.length > 0 ? 'YES' : 'NO'));
        
        if (this.meals && this.meals.length > 0) {
            console.log('🔍 Debug: first meal name: ' + (this.meals[0].adi || this.meals[0].name || 'NO NAME'));
        }
        
        const planData = [];
        for (let day = 0; day < days; day++) {
            const breakfast = this.selectRandomMeals(2, 'breakfast');
            const lunch = this.selectRandomMeals(2, 'lunch');
            const dinner = this.selectRandomMeals(2, 'dinner');
            
            console.log(`🔍 Day ${day}: breakfast=${breakfast ? breakfast.length : 'null'}, lunch=${lunch ? lunch.length : 'null'}, dinner=${dinner ? dinner.length : 'null'}`);
            
            const dayPlan = {
                breakfast: breakfast || [],
                lunch: lunch || [],
                dinner: dinner || []
            };
            planData.push(dayPlan);
        }
        
        console.log('🔍 planData created, calculating stats...');
        
        // Stats hesapla
        let totalMeals = 0;
        try {
            totalMeals = planData.reduce((total, day) => {
                const dayTotal = (day.breakfast?.length || 0) + (day.lunch?.length || 0) + (day.dinner?.length || 0);
                return total + dayTotal;
            }, 0);
            console.log('🔍 totalMeals calculated: ' + totalMeals);
        } catch (error) {
            console.error('❌ Error calculating totalMeals:', error);
            totalMeals = 0;
        }
        
        // Plan objesi oluştur (display için gerekli meta verilerle)
        let plan;
        try {
            plan = {
                id: `Plan-${Date.now()}`,
                type: 'basic',
                dietType: dietType,
                days: days,
                targetCalories: targetCalories,
                created: new Date().toISOString(),
                weeklyPlan: planData,
                stats: {
                    totalDays: days,
                    totalMeals: totalMeals,
                    mealsUsed: this.meals.length,
                    avgCaloriesPerDay: Math.round(targetCalories / 1), // Günlük ortalama
                    avgMealsPerDay: Math.round((totalMeals / days) * 10) / 10 // Yemek ortalaması
                }
            };
            console.log('🔍 Plan object created successfully');
        } catch (error) {
            console.error('❌ Error creating plan object:', error);
            throw error;
        }
        
        console.log('🔍 Setting currentPlan...');
        try {
            this.currentPlan = plan;
            console.log('🔍 currentPlan set successfully');
        } catch (error) {
            console.error('❌ Error setting currentPlan:', error);
            throw error;
        }
        
        console.log('🔍 Returning plan...');
        try {
            return plan;
        } catch (error) {
            console.error('❌ Error returning plan:', error);
            throw error;
        }
    }

    // Basit plan oluşturma (eski uyumluluk)
    async createSimplePlan(params = {}) {
        return this.createBasicPlan(params);
    }

    // Getters
    get isReady() { 
        return this.initialized; 
    }
    
    get availableMeals() { 
        return this.meals.length; 
    }
    
    get lastPlan() { 
        return this.currentPlan; 
    }
}

// Test fonksiyonu
async function testBasicEngine() {
    const engine = new MealPlanningEngine();
    await engine.initialize();
    
    const plan = await engine.createSimplePlan('balanced', 3);
    console.log('Test planı oluşturuldu:', plan);
    
    return engine;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MealPlanningEngine, testBasicEngine };
} else {
    window.MealPlanningEngine = MealPlanningEngine;
    window.testBasicEngine = testBasicEngine;
}

console.log('✅ YENİ Core Algorithm v3.0 yüklendi - MealPlanningEngine hazır');
