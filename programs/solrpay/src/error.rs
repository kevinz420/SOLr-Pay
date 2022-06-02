use anchor_lang::error_code;

#[error_code]
pub enum InputError {
    #[msg("An account for this pubkey already exists")]
    AccountDuplicate,
    #[msg("Username too long.")]
    LongNickname,
}