#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod kredit_agent {

    #[ink(storage)]
    pub struct KreditAgent {}

    impl KreditAgent {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {}
        }

        /// compute_score(balance_tier, gov_votes, gov_conviction, repayments, defaults) → u64
        #[ink(message)]
        pub fn compute_score(
            &self,
            balance_tier: u64,
            gov_votes: u64,
            gov_conviction: u64,
            repayments: u64,
            defaults: u64,
        ) -> u64 {
            let balance = Self::balance_points(balance_tier);
            let governance = Self::governance_points(gov_votes, gov_conviction);
            let repayment = Self::repayment_points(repayments, defaults);
            let total = balance
                .saturating_add(governance)
                .saturating_add(repayment);
            total.min(100)
        }

        /// collateral_ratio(score) → u64 (basis points)
        #[ink(message)]
        pub fn collateral_ratio(&self, score: u64) -> u64 {
            Self::collateral_ratio_internal(score)
        }

        /// interest_rate(score) → u64 (basis points)
        #[ink(message)]
        pub fn interest_rate(&self, score: u64) -> u64 {
            Self::interest_rate_internal(score)
        }

        /// tier(score) → u8
        #[ink(message)]
        pub fn tier(&self, score: u64) -> u8 {
            Self::tier_from_score(score)
        }

        /// reasoning(balance_tier, gov_votes, gov_conviction, repayments, score) → [u8; 256]
        #[ink(message)]
        pub fn reasoning(
            &self,
            balance_tier: u64,
            gov_votes: u64,
            gov_conviction: u64,
            repayments: u64,
            score: u64,
        ) -> [u8; 256] {
            let mut buffer = [b' '; 256];
            let mut cursor = 0usize;

            let balance_pts = Self::balance_points(balance_tier);
            let governance_pts = Self::governance_points(gov_votes, gov_conviction);
            let mut repayment_pts = score.saturating_sub(balance_pts + governance_pts);
            if repayment_pts > 20 {
                repayment_pts = 20;
            }

            let tier_value = Self::tier_from_score(score);
            let tier_label = Self::tier_label(tier_value);

            Self::push_literal(&mut buffer, &mut cursor, b"Balance: TIER");
            Self::push_number(&mut buffer, &mut cursor, balance_tier);
            Self::push_literal(&mut buffer, &mut cursor, b"(");
            Self::push_number(&mut buffer, &mut cursor, balance_pts);
            Self::push_literal(&mut buffer, &mut cursor, b"pts). Governance: ");
            Self::push_number(&mut buffer, &mut cursor, gov_votes);
            Self::push_literal(&mut buffer, &mut cursor, b"votes,");
            Self::push_number(&mut buffer, &mut cursor, gov_conviction);
            Self::push_literal(&mut buffer, &mut cursor, b"xconv(");
            Self::push_number(&mut buffer, &mut cursor, governance_pts);
            Self::push_literal(&mut buffer, &mut cursor, b"pts).\n ");

            Self::push_literal(&mut buffer, &mut cursor, b"Repayment: ");
            Self::push_number(&mut buffer, &mut cursor, repayments);
            Self::push_literal(&mut buffer, &mut cursor, b"loans(");
            Self::push_number(&mut buffer, &mut cursor, repayment_pts);
            Self::push_literal(&mut buffer, &mut cursor, b"pts). Score:");
            Self::push_number(&mut buffer, &mut cursor, score);
            Self::push_literal(&mut buffer, &mut cursor, b"/100. Tier:");
            Self::push_literal(&mut buffer, &mut cursor, tier_label);
            Self::push_literal(&mut buffer, &mut cursor, b".");

            buffer
        }

        fn balance_points(balance_tier: u64) -> u64 {
            match balance_tier {
                4 => 40,
                3 => 30,
                2 => 20,
                1 => 10,
                _ => 0,
            }
        }

        fn governance_points(votes: u64, conviction: u64) -> u64 {
            let base = if votes >= 10 {
                35
            } else if votes >= 5 {
                25
            } else if votes >= 1 {
                12
            } else {
                0
            };

            let bonus = if conviction >= 6 {
                8
            } else if conviction >= 3 {
                5
            } else {
                0
            };

            (base + bonus).min(40)
        }

        fn repayment_points(repayments: u64, defaults: u64) -> u64 {
            if defaults > 0 {
                return 0;
            }

            if repayments >= 3 {
                20
            } else if repayments >= 1 {
                10
            } else {
                0
            }
        }

        fn collateral_ratio_internal(score: u64) -> u64 {
            use substrate_fixed::types::I32F32;

            let base = I32F32::from_num(16000u32);
            let slope = I32F32::from_num(55u32);
            let s = I32F32::from_num(score);

            let raw = (base - s * slope).to_num::<i64>();
            let as_u64 = if raw < 0 { 0 } else { raw as u64 };
            as_u64.clamp(10500, 16000)
        }

        fn interest_rate_internal(score: u64) -> u64 {
            if score >= 85 {
                400
            } else if score >= 70 {
                700
            } else if score >= 50 {
                1100
            } else if score >= 25 {
                1600
            } else {
                2200
            }
        }

        fn tier_from_score(score: u64) -> u8 {
            if score >= 85 {
                4
            } else if score >= 70 {
                3
            } else if score >= 50 {
                2
            } else if score >= 25 {
                1
            } else {
                0
            }
        }

        fn tier_label(tier: u8) -> &'static [u8] {
            match tier {
                4 => b"PLATINUM",
                3 => b"GOLD",
                2 => b"SILVER",
                1 => b"BRONZE",
                _ => b"ANON",
            }
        }

        fn push_literal(target: &mut [u8; 256], cursor: &mut usize, literal: &[u8]) {
            for &byte in literal.iter() {
                if *cursor >= target.len() {
                    return;
                }
                target[*cursor] = byte;
                *cursor += 1;
            }
        }

        fn push_number(target: &mut [u8; 256], cursor: &mut usize, mut number: u64) {
            if *cursor >= target.len() {
                return;
            }

            if number == 0 {
                target[*cursor] = b'0';
                *cursor += 1;
                return;
            }

            let mut digits = [0u8; 20];
            let mut len = 0usize;

            while number > 0 && len < digits.len() {
                digits[len] = (b'0' + (number % 10) as u8);
                number /= 10;
                len += 1;
            }

            while len > 0 && *cursor < target.len() {
                len -= 1;
                target[*cursor] = digits[len];
                *cursor += 1;
            }
        }
    }
}
