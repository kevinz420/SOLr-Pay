use anchor_lang::error_code;

#[error_code]
pub enum InputError {
    #[msg("An account for this pubkey already exists")]
    AccountDuplicate,
    #[msg("Username too long.")]
    LongNickname,
    #[msg("Profile Pic has oversized byte array")]
    LongPfp,
    #[msg("This account could not be found")]
    AccountNotFound,
}