/**
 * GELIŞMIŞ PLANLAMA FAKTÖRLERİ SİSTEMİ v2.0
 * Hiyerarşik öncelik sistemi ile akıllı plan oluşturma
 */

class AdvancedPlanningFactors {
    constructor() {
        this.factorHierarchy = this.initializeFactorHierarchy();
        this.planningRules = this.initializePlanningRules();
        this.scoringWeights = this.initializeScoringWeights();
        console.log('🎯 Gelişmiş Planlama Faktörleri sistemi başlatıldı');
    }

    // 🔥 FAKTÖR HİYERARŞİSİ (En önemli -> En az önemli)
    initializeFactorHierarchy() {
        return {
            // =====================================
            // 1️⃣ KRİTİK FAKTÖRLER (90-100 puan)
            // =====================================
            CRITICAL: {
                allergyRestrictions: {
                    priority: 100,
                    weight: 1.0,
                    type: 'BLOCKING', // Bu fail olursa plan iptal
                    description: 'Alerji ve intolerans kısıtlamaları',
                    checkMethod: 'checkAllergyCompliance'
                },
                mealTypeCompliance: {
                    priority: 98,
                    weight: 0.98,
                    type: 'BLOCKING',
                    description: 'Öğün tipi uyumluluğu (kahvaltılık yemek öğleye gidemez)',
                    checkMethod: 'checkMealTypeCompliance'
                },
                dietTypeCompliance: {
                    priority: 96,
                    weight: 0.96,
                    type: 'BLOCKING',
                    description: 'Diyet tipi uyumluluğu (keto yemeği lowcarb diyetine gidemez)',
                    checkMethod: 'checkDietTypeCompliance'
                },
                seasonCompliance: {
                    priority: 94,
                    weight: 0.94,
                    type: 'BLOCKING',
                    description: 'Sezon uyumluluğu (mevsim dışı yemek verilemez)',
                    checkMethod: 'checkSeasonCompliance'
                },
                medicalDiet: {
                    priority: 92,
                    weight: 0.92,
                    type: 'STRICT',
                    description: 'Medikal diyet gereklilikleri (diyabet, kalp vb.)',
                    checkMethod: 'checkMedicalCompliance'
                },
                calorieConstraints: {
                    priority: 90,
                    weight: 0.90,
                    type: 'STRICT',
                    tolerance: 0.15, // %15 tolerans
                    description: 'Günlük kalori hedefleri',
                    checkMethod: 'checkCalorieCompliance'
                }
            },

            // =====================================
            // 2️⃣ TEMEL FAKTÖRLER (70-89 puan)
            // =====================================
            PRIMARY: {
                macroBalance: {
                    priority: 85,
                    weight: 0.85,
                    type: 'HIGH_PRIORITY',
                    tolerance: 0.20, // %20 tolerans
                    description: 'Makro besin dengeleri (P/C/F oranları)',
                    checkMethod: 'checkMacroBalance'
                },
                mealDistribution: {
                    priority: 80,
                    weight: 0.80,
                    type: 'HIGH_PRIORITY',
                    description: 'Öğün dağılımı ve kalori oranları',
                    checkMethod: 'checkMealDistribution'
                },
                dietTypeCompliance: {
                    priority: 75,
                    weight: 0.75,
                    type: 'HIGH_PRIORITY',
                    description: 'Diyet tipi uyumluluğu (keto, vegan vb.)',
                    checkMethod: 'checkDietTypeCompliance'
                },
                nutritionalCompleteness: {
                    priority: 72,
                    weight: 0.72,
                    type: 'HIGH_PRIORITY',
                    description: 'Besinsel tamlık (vitamin, mineral)',
                    checkMethod: 'checkNutritionalCompleteness'
                }
            },

            // =====================================
            // 3️⃣ OPTİMİZASYON FAKTÖRLERİ (50-69 puan)
            // =====================================
            OPTIMIZATION: {
                varietyScore: {
                    priority: 68,
                    weight: 0.68,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Çeşitlilik ve tekrar önleme',
                    checkMethod: 'calculateVarietyScore'
                },
                favoriteBoost: {
                    priority: 65,
                    weight: 0.65,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Sevilen yemeklerin pozitif ayrımcılığı',
                    checkMethod: 'calculateFavoriteBoost'
                },
                compatibilityMagnetism: {
                    priority: 62,
                    weight: 0.62,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Yemekler arası uyumluluk manyetizması',
                    checkMethod: 'checkMealCompatibility'
                },
                fillerOptimization: {
                    priority: 60,
                    weight: 0.60,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Dolgu yemekler ile makro açık kapatma',
                    checkMethod: 'checkFillerOptimization'
                },
                seasonalPreference: {
                    priority: 58,
                    weight: 0.58,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Mevsimsel uygunluk tercihi',
                    checkMethod: 'checkSeasonalPreference'
                },
                portionOptimization: {
                    priority: 55,
                    weight: 0.55,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Porsiyon katsayıları optimizasyonu',
                    checkMethod: 'checkPortionOptimization'
                },
                cookingComplexity: {
                    priority: 52,
                    weight: 0.52,
                    type: 'MEDIUM_PRIORITY',
                    description: 'Pişirme zorluğu dengesi',
                    checkMethod: 'checkCookingComplexity'
                }
            },

            // =====================================
            // 4️⃣ TERCİH FAKTÖRLERİ (20-49 puan)
            // =====================================
            PREFERENCE: {
                personalTastes: {
                    priority: 45,
                    weight: 0.45,
                    type: 'LOW_PRIORITY',
                    description: 'Kişisel tat tercihleri',
                    checkMethod: 'checkPersonalTastes'
                },
                culturalPreference: {
                    priority: 40,
                    weight: 0.40,
                    type: 'LOW_PRIORITY',
                    description: 'Kültürel yemek tercihleri',
                    checkMethod: 'checkCulturalPreference'
                },
                budgetConstraints: {
                    priority: 35,
                    weight: 0.35,
                    type: 'LOW_PRIORITY',
                    description: 'Bütçe kısıtlamaları',
                    checkMethod: 'checkBudgetConstraints'
                },
                preparationTime: {
                    priority: 30,
                    weight: 0.30,
                    type: 'LOW_PRIORITY',
                    description: 'Hazırlama süresi tercihleri',
                    checkMethod: 'checkPreparationTime'
                }
            }
        };
    }

    // 🎯 PLANLAMA KURALLARI
    initializePlanningRules() {
        return {
            // Kalori dağılım kuralları
            calorieDistribution: {
                breakfast: { min: 20, max: 30, ideal: 25 }, // %25
                lunch: { min: 30, max: 40, ideal: 35 },     // %35  
                dinner: { min: 25, max: 35, ideal: 30 },    // %30
                snack: { min: 5, max: 15, ideal: 10 }       // %10
            },

            // Makro besin kuralları
            macroRatios: {
                balanced: { protein: 20, carbs: 50, fat: 30 },
                lowcarb: { protein: 25, carbs: 30, fat: 45 },
                keto: { protein: 20, carbs: 10, fat: 70 },
                highprotein: { protein: 35, carbs: 35, fat: 30 },
                vegan: { protein: 15, carbs: 60, fat: 25 }
            },

            // Çeşitlilik kuralları
            varietyRules: {
                maxSameCategory: 2,      // Aynı kategoriden max 2 yemek/gün
                maxSameMeal: 1,          // Aynı yemek max 1 kez/gün  
                weeklyVariety: 70,       // Haftalık %70 farklı yemek
                avoidConsecutive: true   // Aynı yemek ard arda gün gelmesin
            },

            // Uyumluluk kuralları
            compatibilityRules: {
                avoidConflicts: true,           // Çelişen yemekleri önle
                enforceComplements: true,       // Tamamlayıcı yemekleri teşvik et
                respectMealStructure: true      // Öğün yapısına uy (çorba+ana+yan)
            }
        };
    }

    // 📊 SKORLAMA AĞIRLIKLARI
    initializeScoringWeights() {
        return {
            // Toplam skor hesaplama ağırlıkları
            CRITICAL: 0.5,      // %50 - Kritik faktörler
            PRIMARY: 0.3,       // %30 - Temel faktörler  
            OPTIMIZATION: 0.15, // %15 - Optimizasyon faktörleri
            PREFERENCE: 0.05,   // %5  - Tercih faktörleri
            
            // Bonus/ceza çarpanları
            bonusMultipliers: {
                perfectMatch: 1.2,      // Mükemmel eşleşme %20 bonus
                goodVariety: 1.1,       // İyi çeşitlilik %10 bonus
                seasonalMatch: 1.05     // Mevsimsel uyum %5 bonus
            },
            
            penaltyMultipliers: {
                allergyViolation: 0,    // Alerji ihlali = 0 puan
                medicalViolation: 0.1,  // Medikal ihlal %90 ceza
                calorieMismatch: 0.7,   // Kalori uyumsuzluğu %30 ceza
                poorVariety: 0.8        // Kötü çeşitlilik %20 ceza
            }
        };
    }

    // 🎯 ANA DEĞERLENDİRME FONKSİYONU
    evaluatePlanCandidate(planCandidate, patientProfile, planningContext) {
        const evaluation = {
            totalScore: 0,
            categoryScores: {},
            violations: [],
            recommendations: [],
            isValid: true
        };

        try {
            // 1. Kritik faktörleri değerlendir (BLOCKING)
            const criticalScore = this.evaluateCriticalFactors(planCandidate, patientProfile);
            if (criticalScore.hasBlockingViolations) {
                evaluation.isValid = false;
                evaluation.violations.push(...criticalScore.violations);
                return evaluation; // Kritik hata varsa diğerlerini kontrol etme
            }
            evaluation.categoryScores.CRITICAL = criticalScore.score;

            // 2. Temel faktörleri değerlendir
            const primaryScore = this.evaluatePrimaryFactors(planCandidate, patientProfile);
            evaluation.categoryScores.PRIMARY = primaryScore.score;
            evaluation.violations.push(...primaryScore.violations);

            // 3. Optimizasyon faktörlerini değerlendir
            const optimizationScore = this.evaluateOptimizationFactors(planCandidate, planningContext);
            evaluation.categoryScores.OPTIMIZATION = optimizationScore.score;

            // 4. Tercih faktörlerini değerlendir
            const preferenceScore = this.evaluatePreferenceFactors(planCandidate, patientProfile);
            evaluation.categoryScores.PREFERENCE = preferenceScore.score;

            // 5. Toplam skoru hesapla
            evaluation.totalScore = this.calculateTotalScore(evaluation.categoryScores);

            // 6. Önerileri oluştur
            evaluation.recommendations = this.generateRecommendations(evaluation);

            console.log('📊 Plan adayı değerlendirildi:', {
                totalScore: evaluation.totalScore.toFixed(2),
                isValid: evaluation.isValid,
                violations: evaluation.violations.length
            });

            return evaluation;

        } catch (error) {
            console.error('❌ Plan değerlendirme hatası:', error);
            evaluation.isValid = false;
            evaluation.violations.push({
                type: 'SYSTEM_ERROR',
                severity: 'CRITICAL',
                message: 'Plan değerlendirme sistemi hatası: ' + error.message
            });
            return evaluation;
        }
    }

    // 🚨 KRİTİK FAKTÖR DEĞERLENDİRMESİ
    evaluateCriticalFactors(planCandidate, patientProfile) {
        const result = {
            score: 0,
            violations: [],
            hasBlockingViolations: false
        };

        const criticalFactors = this.factorHierarchy.CRITICAL;
        let totalWeight = 0;
        let weightedScore = 0;

        for (const [factorName, factor] of Object.entries(criticalFactors)) {
            try {
                // Her kritik faktörü kontrol et
                const factorResult = this[factor.checkMethod](planCandidate, patientProfile, factor);
                
                if (factorResult.isBlocking) {
                    result.hasBlockingViolations = true;
                    result.violations.push({
                        type: 'BLOCKING',
                        factor: factorName,
                        severity: 'CRITICAL',
                        message: factorResult.message,
                        details: factorResult.details
                    });
                }

                weightedScore += factorResult.score * factor.weight;
                totalWeight += factor.weight;

            } catch (error) {
                console.error(`❌ Kritik faktör hatası [${factorName}]:`, error);
                result.hasBlockingViolations = true;
                result.violations.push({
                    type: 'SYSTEM_ERROR',
                    factor: factorName,
                    severity: 'CRITICAL',
                    message: `Sistem hatası: ${error.message}`
                });
            }
        }

        result.score = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
        return result;
    }

    // 🎯 TEMEL FAKTÖR DEĞERLENDİRMESİ  
    evaluatePrimaryFactors(planCandidate, patientProfile) {
        const result = {
            score: 0,
            violations: []
        };

        const primaryFactors = this.factorHierarchy.PRIMARY;
        let totalWeight = 0;
        let weightedScore = 0;

        for (const [factorName, factor] of Object.entries(primaryFactors)) {
            try {
                const factorResult = this[factor.checkMethod](planCandidate, patientProfile, factor);
                
                if (factorResult.violations && factorResult.violations.length > 0) {
                    result.violations.push(...factorResult.violations.map(v => ({
                        ...v,
                        factor: factorName,
                        severity: 'HIGH'
                    })));
                }

                weightedScore += factorResult.score * factor.weight;
                totalWeight += factor.weight;

            } catch (error) {
                console.error(`❌ Temel faktör hatası [${factorName}]:`, error);
                result.violations.push({
                    type: 'SYSTEM_ERROR',
                    factor: factorName,
                    severity: 'HIGH',
                    message: `Sistem hatası: ${error.message}`
                });
            }
        }

        result.score = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
        return result;
    }

    // 🎯 OPTİMİZASYON FAKTÖR DEĞERLENDİRMESİ
    evaluateOptimizationFactors(planCandidate, planningContext) {
        const result = { score: 0 };
        // Implementation will be added
        return result;
    }

    // 🎯 TERCİH FAKTÖR DEĞERLENDİRMESİ
    evaluatePreferenceFactors(planCandidate, patientProfile) {
        const result = { score: 0 };
        // Implementation will be added  
        return result;
    }

    // 📊 TOPLAM SKOR HESAPLAMA
    calculateTotalScore(categoryScores) {
        const weights = this.scoringWeights;
        
        const critical = (categoryScores.CRITICAL || 0) * weights.CRITICAL;
        const primary = (categoryScores.PRIMARY || 0) * weights.PRIMARY;
        const optimization = (categoryScores.OPTIMIZATION || 0) * weights.OPTIMIZATION;
        const preference = (categoryScores.PREFERENCE || 0) * weights.PREFERENCE;

        return critical + primary + optimization + preference;
    }

    // 💡 ÖNERİ OLUŞTURMA
    generateRecommendations(evaluation) {
        const recommendations = [];
        
        if (evaluation.totalScore < 60) {
            recommendations.push({
                type: 'WARNING',
                message: 'Plan kalitesi düşük. Daha iyi alternatifler aranmalı.',
                priority: 'HIGH'
            });
        }

        if (evaluation.violations.length > 0) {
            recommendations.push({
                type: 'IMPROVEMENT',
                message: `${evaluation.violations.length} kural ihlali tespit edildi.`,
                priority: 'MEDIUM',
                details: evaluation.violations
            });
        }

        return recommendations;
    }

    // ======================================================================
    // 🔍 KRİTİK FAKTÖR KONTROL METODLARİ
    // ======================================================================

    checkAllergyCompliance(planCandidate, patientProfile, factor) {
        const result = {
            score: 100,
            isBlocking: false,
            message: '',
            details: {}
        };

        // Alerji/İstememe listesi kontrolü (LEVEL 1 - MUTLAK KURAL)
        const allergies = patientProfile.allergies || [];
        const dislikes = patientProfile.dislikes || [];
        const forbiddenItems = [...allergies, ...dislikes];

        if (forbiddenItems.length === 0) {
            result.message = 'Alerji/İstememe kısıtlaması yok';
            return result;
        }

        // Plan içindeki tüm yemekleri kontrol et
        const violations = [];
        
        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    // 🔍 YENİ: Gelişmiş alerji kontrolü
                    const foodViolations = this.checkFoodForViolations(food, forbiddenItems);
                    
                    if (foodViolations.length > 0) {
                        violations.push({
                            day: day.dayNumber,
                            meal: meal.type,
                            food: food.name || food.adi,
                            violations: foodViolations,
                            foodTags: food.tags || [],
                            reason: 'Alerji/İstememe listesinde'
                        });
                    }
                }
            }
        }

        if (violations.length > 0) {
            result.score = 0;
            result.isBlocking = true; // MUTLAK ENGELLEME
            result.message = `${violations.length} alerji/istememe ihlali tespit edildi`;
            result.details = { violations };
        } else {
            result.message = 'Alerji/İstememe kontrolü başarılı';
        }

        return result;
    }

    // 🔍 YENİ: Yemekte yasak madde kontrolü
    checkFoodForViolations(food, forbiddenItems) {
        const violations = [];
        const foodName = (food.name || food.adi || '').toLowerCase();
        const foodTags = (food.tags || []).map(tag => tag.toLowerCase());
        
        for (const forbidden of forbiddenItems) {
            const forbiddenLower = forbidden.toLowerCase();
            
            // 1. Yemek adında geçiyor mu?
            if (foodName.includes(forbiddenLower)) {
                violations.push({
                    type: 'NAME_MATCH',
                    forbidden: forbidden,
                    matched: 'name'
                });
            }
            
            // 2. Tags içinde geçiyor mu?
            const matchedTag = foodTags.find(tag => 
                tag.includes(forbiddenLower) || forbiddenLower.includes(tag)
            );
            
            if (matchedTag) {
                violations.push({
                    type: 'TAG_MATCH',
                    forbidden: forbidden,
                    matched: matchedTag
                });
            }
        }
        
        return violations;
    }

    checkMedicalCompliance(planCandidate, patientProfile, factor) {
        const result = {
            score: 100,
            isBlocking: false,
            message: '',
            details: {}
        };

        if (!patientProfile.medicalConditions || patientProfile.medicalConditions.length === 0) {
            result.message = 'Medikal kısıtlama yok';
            return result;
        }

        // Medikal kısıtlamaları kontrol et
        const medicalViolations = [];

        // Örnek: Diyabet hastası için şeker kısıtlaması
        if (patientProfile.medicalConditions.includes('diabetes')) {
            const sugarViolations = this.checkSugarRestrictions(planCandidate);
            if (sugarViolations.length > 0) {
                medicalViolations.push(...sugarViolations);
            }
        }

        // Örnek: Kalp hastası için sodyum kısıtlaması
        if (patientProfile.medicalConditions.includes('heart_disease')) {
            const sodiumViolations = this.checkSodiumRestrictions(planCandidate);
            if (sodiumViolations.length > 0) {
                medicalViolations.push(...sodiumViolations);
            }
        }

        if (medicalViolations.length > 0) {
            result.score = 20; // %80 ceza ama tamamen bloklamıyor
            result.isBlocking = false;
            result.message = `${medicalViolations.length} medikal kısıtlama ihlali`;
            result.details = { violations: medicalViolations };
        } else {
            result.message = 'Medikal kısıtlama kontrolü başarılı';
        }

        return result;
    }

    checkCalorieCompliance(planCandidate, patientProfile, factor) {
        const result = {
            score: 100,
            isBlocking: false,
            message: '',
            details: {}
        };

        const targetCalories = patientProfile.targetCalories || 2000;
        const tolerance = factor.tolerance || 0.15; // %15 tolerans
        const minCalories = targetCalories * (1 - tolerance);
        const maxCalories = targetCalories * (1 + tolerance);

        let totalCaloriesViolations = 0;
        const dailyCalories = [];

        // Her günün toplam kalorisini hesapla
        for (const day of planCandidate.days) {
            let dayTotalCalories = 0;
            
            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    dayTotalCalories += food.calories || 0;
                }
            }
            
            dailyCalories.push({
                day: day.dayNumber,
                calories: dayTotalCalories,
                target: targetCalories,
                inRange: dayTotalCalories >= minCalories && dayTotalCalories <= maxCalories
            });

            if (!dailyCalories[dailyCalories.length - 1].inRange) {
                totalCaloriesViolations++;
            }
        }

        // Skorlama
        const violationRatio = totalCaloriesViolations / planCandidate.days.length;
        
        if (violationRatio > 0.5) { // %50'den fazla gün ihlal
            result.score = 30;
            result.isBlocking = false;
            result.message = `Kalori hedefi ${totalCaloriesViolations} günde ihlal edildi`;
        } else if (violationRatio > 0.2) { // %20'den fazla gün ihlal
            result.score = 70;
            result.message = `Kalori hedefi bazı günlerde ihlal edildi`;
        } else {
            result.message = 'Kalori hedefi uygun aralıkta';
        }

        result.details = {
            targetCalories,
            toleranceRange: [minCalories, maxCalories],
            dailyCalories,
            violationDays: totalCaloriesViolations
        };

        return result;
    }

    // Yardımcı metodlar
    checkSugarRestrictions(planCandidate) {
        // Diyabet hastası için şeker kontrolü implementasyonu
        return [];
    }

    checkSodiumRestrictions(planCandidate) {
        // Kalp hastası için sodyum kontrolü implementasyonu  
        return [];
    }

    // Diğer kontrol metodları buraya eklenecek...
    checkMacroBalance(planCandidate, patientProfile, factor) {
        return { score: 80, violations: [] };
    }

    checkMealDistribution(planCandidate, patientProfile, factor) {
        return { score: 85, violations: [] };
    }

    checkDietTypeCompliance(planCandidate, patientProfile, factor) {
        const result = {
            score: 100,
            isBlocking: false,
            message: '',
            violations: [],
            details: {}
        };

        const patientDietType = patientProfile.dietType;
        if (!patientDietType) {
            result.message = 'Diyet tipi belirtilmemiş';
            return result;
        }

        const violations = [];

        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    // 🎯 YENİ: Diyet uyumluluk kontrolü (veritabanı yapısına göre)
                    const isDietCompliant = this.checkFoodDietCompliance(food, patientDietType);
                    
                    if (!isDietCompliant.isCompliant) {
                        violations.push({
                            day: day.dayNumber,
                            meal: meal.type,
                            food: food.name || food.adi,
                            dietType: patientDietType,
                            reason: isDietCompliant.reason,
                            availableDiets: isDietCompliant.availableDiets
                        });
                    }
                }
            }
        }

        if (violations.length > 0) {
            result.score = 20; // Ağır ceza ama bloklamıyor
            result.isBlocking = false;
            result.message = `${violations.length} diyet uyumsuzluğu tespit edildi`;
            result.violations = violations.map(v => ({
                type: 'DIET_VIOLATION',
                severity: 'HIGH',
                message: `${v.food} yemeği ${v.dietType} diyetine uygun değil`,
                details: v
            }));
        } else {
            result.message = `${patientDietType} diyet uyumluluğu başarılı`;
        }

        return result;
    }

    // 🎯 YENİ: Yemek diyet uyumluluğu kontrolü
    checkFoodDietCompliance(food, requiredDietType) {
        const result = {
            isCompliant: false,
            reason: '',
            availableDiets: []
        };

        // Mevcut diyet türlerine göre kontrol et
        const dietFields = ['keto', 'lowcarb']; // Genişletilebilir
        
        for (const diet of dietFields) {
            if (food[diet] === true) {
                result.availableDiets.push(diet);
            }
        }

        // Gerekli diyet tipine uygun mu?
        switch (requiredDietType.toLowerCase()) {
            case 'keto':
            case 'ketogenic':
                result.isCompliant = food.keto === true;
                break;
            case 'lowcarb':
            case 'low-carb':
                result.isCompliant = food.lowcarb === true;
                break;
            default:
                result.isCompliant = true; // Genel beslenme için tüm yemekler uygun
                break;
        }

        if (!result.isCompliant) {
            result.reason = `Yemek ${requiredDietType} diyeti için işaretlenmemiş`;
        }

        return result;
    }

    checkNutritionalCompleteness(planCandidate, patientProfile, factor) {
        return { score: 75, violations: [] };
    }

    // 🎯 YENİ: MealType uyumluluğu kontrolü (LEVEL 1 - MUTLAK KURAL)
    checkMealTypeCompliance(planCandidate, patientProfile, factor) {
        const result = {
            score: 100,
            isBlocking: false,
            message: '',
            details: {}
        };

        const violations = [];

        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                const mealTypeName = meal.type; // breakfast, lunch, dinner
                
                for (const food of meal.foods) {
                    const allowedMealTypes = food.mealType || [];
                    
                    // 🚫 MUTLAK KURAL: Yemek bu öğüne verilebilir mi?
                    if (!this.isMealTypeAllowed(mealTypeName, allowedMealTypes)) {
                        violations.push({
                            day: day.dayNumber,
                            meal: mealTypeName,
                            food: food.name || food.adi,
                            allowedMealTypes: allowedMealTypes,
                            reason: `${food.name} sadece ${allowedMealTypes.join(', ')} öğünlerinde verilebilir`
                        });
                    }
                }
            }
        }

        if (violations.length > 0) {
            result.score = 0;
            result.isBlocking = true; // MUTLAK ENGELLEME
            result.message = `${violations.length} öğün tipi ihlali tespit edildi`;
            result.details = { violations };
        } else {
            result.message = 'Öğün tipi uyumluluğu başarılı';
        }

        return result;
    }

    // Yardımcı method: MealType izin kontrolü
    isMealTypeAllowed(currentMealType, allowedMealTypes) {
        if (!allowedMealTypes || allowedMealTypes.length === 0) {
            return true; // Kısıtlama yoksa her öğüne verilebilir
        }

        // Türkçe-İngilizce çeviri mapping
        const mealTypeMapping = {
            'breakfast': ['breakfast', 'kahvaltı'],
            'lunch': ['lunch', 'öğle', 'ÖĞLEN'],
            'dinner': ['dinner', 'akşam', 'AKŞAM'],
            'snack': ['snack', 'ara öğün']
        };

        const currentVariants = mealTypeMapping[currentMealType.toLowerCase()] || [currentMealType];
        
        return allowedMealTypes.some(allowed => 
            currentVariants.includes(allowed.toLowerCase()) ||
            currentVariants.some(variant => allowed.toLowerCase().includes(variant))
        );
    }

    // 🎯 YENİ: Sezon uyumluluğu kontrolü (LEVEL 1 - MUTLAK KURAL)
    checkSeasonCompliance(planCandidate, patientProfile, factor) {
        const result = {
            score: 100,
            isBlocking: false,
            message: '',
            details: {}
        };

        const currentMonth = new Date().getMonth() + 1; // 1-12
        const violations = [];

        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    const seasonCompliance = this.checkFoodSeasonCompliance(food, currentMonth);
                    
                    if (!seasonCompliance.isCompliant) {
                        violations.push({
                            day: day.dayNumber,
                            meal: meal.type,
                            food: food.name || food.adi,
                            currentMonth: currentMonth,
                            allowedRange: seasonCompliance.allowedRange,
                            reason: seasonCompliance.reason
                        });
                    }
                }
            }
        }

        if (violations.length > 0) {
            result.score = 0;
            result.isBlocking = true; // MUTLAK ENGELLEME
            result.message = `${violations.length} sezon uyumsuzluğu tespit edildi`;
            result.details = { violations };
        } else {
            result.message = 'Sezon uyumluluğu başarılı';
        }

        return result;
    }

    // Yardımcı method: Sezon uyumluluk kontrolü
    checkFoodSeasonCompliance(food, currentMonth) {
        const result = {
            isCompliant: true,
            reason: '',
            allowedRange: []
        };

        let seasonRange = food.seasonRange;
        if (!seasonRange) {
            return result; // Sezon kısıtlaması yoksa her zaman uygun
        }

        // JSON string format kontrolü "[1,12]" -> [1,12]
        if (typeof seasonRange === 'string') {
            try {
                seasonRange = JSON.parse(seasonRange);
            } catch (e) {
                console.warn('Sezon aralığı parse edilemedi:', seasonRange);
                return result;
            }
        }

        if (!Array.isArray(seasonRange) || seasonRange.length !== 2) {
            return result;
        }

        const [startMonth, endMonth] = seasonRange;
        result.allowedRange = seasonRange;

        // Tersine sezon kontrolü (isReversedSeason)
        if (food.isReversedSeason) {
            // Ters sezon: belirtilen aralık DışINDA uygun
            if (currentMonth >= startMonth && currentMonth <= endMonth) {
                result.isCompliant = false;
                result.reason = `Ters sezon yemeği - ${startMonth}-${endMonth} ayları arasında verilemez`;
            }
        } else {
            // Normal sezon: belirtilen aralık İÇİNDE uygun
            if (currentMonth < startMonth || currentMonth > endMonth) {
                result.isCompliant = false;
                result.reason = `Sadece ${startMonth}-${endMonth} ayları arasında verilebilir`;
            }
        }

        return result;
    }

    calculateVarietyScore(planCandidate, planningContext, factor) {
        return { score: 70 };
    }

    // 🌟 YENİ: Sevilen yemeklerin pozitif ayrımcılık hesabı
    calculateFavoriteBoost(planCandidate, patientProfile, factor) {
        const result = { score: 50 }; // Baseline score

        const favorites = patientProfile.favorites || [];
        if (favorites.length === 0) {
            result.message = 'Sevilen yemek listesi boş';
            return result;
        }

        const favoriteBoostRatio = patientProfile.favoriteBoostRatio || 0.20; // Default %20
        let totalFoods = 0;
        let favoriteFoods = 0;

        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    totalFoods++;
                    
                    // Sevilen yemek kontrolü
                    if (this.isFavoriteFood(food, favorites)) {
                        favoriteFoods++;
                    }
                }
            }
        }

        if (totalFoods === 0) {
            return result;
        }

        const favoriteRatio = favoriteFoods / totalFoods;
        const expectedRatio = favoriteBoostRatio;
        
        // Sevilen yemek oranına göre skorlama
        if (favoriteRatio >= expectedRatio) {
            result.score = 80 + (favoriteRatio * 20); // 80-100 arası
            result.message = `Sevilen yemek oranı iyi: %${(favoriteRatio*100).toFixed(1)}`;
        } else {
            result.score = 50 + (favoriteRatio / expectedRatio) * 30; // 50-80 arası
            result.message = `Sevilen yemek oranı düşük: %${(favoriteRatio*100).toFixed(1)}`;
        }

        result.details = {
            favoriteFoods,
            totalFoods,
            ratio: favoriteRatio,
            expectedRatio
        };

        return result;
    }

    // Yardımcı: Sevilen yemek kontrolü
    isFavoriteFood(food, favorites) {
        const foodName = (food.name || food.adi || '').toLowerCase();
        const foodTags = (food.tags || []).map(tag => tag.toLowerCase());
        
        return favorites.some(favorite => {
            const favLower = favorite.toLowerCase();
            return foodName.includes(favLower) || 
                   foodTags.some(tag => tag.includes(favLower) || favLower.includes(tag));
        });
    }

    checkSeasonalPreference(planCandidate, planningContext, factor) {
        return { score: 65 };
    }

    checkMealCompatibility(planCandidate, planningContext, factor) {
        const result = { score: 50 };

        let totalMeals = 0;
        let compatibleMeals = 0;

        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                totalMeals++;
                
                // Ana yemekleri bul (mainDish role)
                const mainDishes = meal.foods.filter(food => food.role === 'mainDish');
                
                if (mainDishes.length === 0) {
                    continue; // Ana yemek yoksa uyumluluk kontrolü yapma
                }

                // Her ana yemek için uyumluluk kontrolü
                for (const mainDish of mainDishes) {
                    const compatibilityScore = this.calculateMealCompatibilityScore(meal, mainDish);
                    if (compatibilityScore > 0.5) { // %50'den yüksek uyumluluk
                        compatibleMeals++;
                    }
                }
            }
        }

        if (totalMeals > 0) {
            const compatibilityRatio = compatibleMeals / totalMeals;
            result.score = 30 + (compatibilityRatio * 70); // 30-100 arası
            result.message = `Uyumluluk oranı: %${(compatibilityRatio*100).toFixed(1)}`;
        }

        return result;
    }

    // 🧲 YENİ: Uyumluluk manyetizması hesabı
    calculateMealCompatibilityScore(meal, mainDish) {
        let compatibilityScore = 0;
        let totalChecks = 0;

        const compatibilityTags = mainDish.compatibilityTags || [];
        const incompatibilityTags = mainDish.incompatibilityTags || [];
        
        // Diğer yemeklerle uyumluluğu kontrol et
        for (const otherFood of meal.foods) {
            if (otherFood === mainDish) continue;
            
            const otherTags = otherFood.tags || [];
            totalChecks++;

            // Pozitif uyumluluk kontrolü
            const hasPositiveMatch = compatibilityTags.some(compTag => 
                otherTags.some(tag => tag.toLowerCase().includes(compTag.toLowerCase()))
            );

            // Negatif uyumsuzluk kontrolü  
            const hasNegativeMatch = incompatibilityTags.some(incompTag =>
                otherTags.some(tag => tag.toLowerCase().includes(incompTag.toLowerCase()))
            );

            if (hasPositiveMatch) {
                compatibilityScore += 1;
            } else if (hasNegativeMatch) {
                compatibilityScore -= 1;
            }
        }

        return totalChecks > 0 ? Math.max(0, compatibilityScore / totalChecks) : 0;
    }

    // 🥄 YENİ: Dolgu yemek optimizasyonu
    checkFillerOptimization(planCandidate, patientProfile, factor) {
        const result = { score: 60 };

        const targetMacros = patientProfile.targetMacros || {};
        if (!targetMacros.protein && !targetMacros.fat) {
            result.message = 'Hedef makrolar belirtilmemiş';
            return result;
        }

        let fillerUsageScore = 0;
        let totalDays = planCandidate.days.length;

        for (const day of planCandidate.days) {
            const dayMacros = this.calculateDayMacros(day);
            const macroGaps = this.calculateMacroGaps(dayMacros, targetMacros);
            const fillerUsage = this.calculateFillerUsage(day, macroGaps);
            
            fillerUsageScore += fillerUsage.score;
        }

        result.score = Math.min(100, 40 + (fillerUsageScore / totalDays) * 60);
        result.message = `Dolgu yemek optimizasyonu skoru: ${result.score.toFixed(0)}`;

        return result;
    }

    // Yardımcı: Günlük makro hesaplama
    calculateDayMacros(day) {
        let totalCalories = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

        for (const meal of day.meals) {
            for (const food of meal.foods) {
                const multiplier = food.multiplier || 1;
                totalCalories += (food.calories || 0) * multiplier;
                totalProtein += (food.protein || 0) * multiplier;
                totalCarbs += (food.carbs || 0) * multiplier;
                totalFat += (food.fat || 0) * multiplier;
            }
        }

        return { calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat };
    }

    // Yardımcı: Makro açık hesaplama
    calculateMacroGaps(actualMacros, targetMacros) {
        return {
            protein: (targetMacros.protein || 0) - actualMacros.protein,
            carbs: (targetMacros.carbs || 0) - actualMacros.carbs,
            fat: (targetMacros.fat || 0) - actualMacros.fat
        };
    }

    // Yardımcı: Dolgu yemek kullanım skoru
    calculateFillerUsage(day, macroGaps) {
        const result = { score: 0, used: 0 };
        
        for (const meal of day.meals) {
            for (const food of meal.foods) {
                // Dolgu yemek mi kontrol et
                const isFillerLunch = food.fillerLunch === true;
                const isFillerDinner = food.fillerDinner === true;
                
                if (isFillerLunch || isFillerDinner) {
                    result.used++;
                    
                    // Doğru makro açığına göre kullanılmış mı?
                    if (macroGaps.protein > 10 && (food.protein || 0) > 10) {
                        result.score += 20; // Protein açığı için protein yoğun dolgu
                    }
                    if (macroGaps.fat > 5 && (food.fat || 0) > 5) {
                        result.score += 20; // Yağ açığı için yağ yoğun dolgu
                    }
                }
            }
        }

        return result;
    }

    // 🥗 YENİ: Porsiyon optimizasyonu
    checkPortionOptimization(planCandidate, patientProfile, factor) {
        const result = { score: 70 };

        let totalOptimizations = 0;
        let successfulOptimizations = 0;

        for (const day of planCandidate.days) {
            for (const meal of day.meals) {
                for (const food of meal.foods) {
                    const multiplier = food.multiplier || 1;
                    const minQuantity = food.minQuantity || 0.5;
                    const maxQuantity = food.maxQuantity || 2.0;
                    
                    totalOptimizations++;
                    
                    // Porsiyon range içinde mi?
                    if (multiplier >= minQuantity && multiplier <= maxQuantity) {
                        successfulOptimizations++;
                        
                        // Öğün başına en fazla 1 optimizasyon yapılmış mı?
                        // (Bu kontrol geliştirilmeli - mealın kaç yemeğinin optimize edildiği)
                    }
                }
            }
        }

        if (totalOptimizations > 0) {
            const optimizationRatio = successfulOptimizations / totalOptimizations;
            result.score = 50 + (optimizationRatio * 50);
            result.message = `Porsiyon optimizasyon oranı: %${(optimizationRatio*100).toFixed(1)}`;
        }

        return result;
    }

    checkCookingComplexity(planCandidate, planningContext, factor) {
        return { score: 60 };
    }

    checkPersonalTastes(planCandidate, patientProfile, factor) {
        return { score: 50 };
    }

    checkCulturalPreference(planCandidate, patientProfile, factor) {
        return { score: 55 };
    }

    checkBudgetConstraints(planCandidate, patientProfile, factor) {
        return { score: 45 };
    }

    checkPreparationTime(planCandidate, patientProfile, factor) {
        return { score: 40 };
    }
}

// Export
window.AdvancedPlanningFactors = AdvancedPlanningFactors;
console.log('🎯 AdvancedPlanningFactors sistemi yüklendi');
