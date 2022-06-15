use anchor_lang::prelude::*;

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

    pub fn get_vec(&mut self) -> Result<&mut Vec<Pubkey>> {
        Ok(&mut self.friends)
    }

    pub fn add_friend(&mut self, old_vec: &mut Vec<Pubkey>, friend: Pubkey) -> Result<()> {
        self.friends = vec![friend];
        self.friends.append(old_vec);
        self.friends.shrink_to_fit();
        Ok(())
    }

    pub fn remove_friend(&mut self, old_vec: &Vec<Pubkey>, friend: Pubkey) -> Result<()> {
        self.friends = old_vec.to_vec();
        self.friends.retain(|&x| x != friend);
        self.friends.shrink_to_fit();
        Ok(())
    }
}