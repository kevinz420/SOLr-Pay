use anchor_lang::prelude::*;
use crate::error::InputError;

#[account]
pub struct Friend {
    friends: Vec<Pubkey> // 4 additional bytes
}

impl Friend {
    pub const STATIC_SIZE: usize = 8 + 4;
    
    pub fn initialize(&mut self) -> Result<()> {
        self.friends = Vec::new();
        Ok(())
    }

    pub fn update_fcount(&self, add: bool) -> usize {
        if add {self.friends.len() + 1} else {self.friends.len() - 1}
    }

    pub fn add_friend(&mut self, friend: Pubkey) -> Result<()> {
        if self.friends.contains(&friend) {
            return Err(InputError::DuplicateFriend.into())
        }
        let mut f = vec!(friend);
        self.friends.append(&mut f);
        self.friends.shrink_to_fit();
        Ok(())
    }

    pub fn remove_friend(&mut self, friend: &Pubkey) -> Result<()> {
        if self.friends.contains(&friend) {
            self.friends.retain(|x| *x != *friend);
            self.friends.shrink_to_fit();
            return Ok(())
        }
        
        Err(InputError::FriendNotFound.into())
    }
}