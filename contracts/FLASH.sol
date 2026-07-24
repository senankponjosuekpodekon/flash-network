// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FLASH is ERC20, Ownable {

    // Supply maximale autorisée
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10 ** 18;


    // Gestion des wallets gelés
    mapping(address => bool) public frozen;


    // Gestion des wallets blacklistés
    mapping(address => bool) public blacklisted;


    // Variables du nom et symbole modifiables
    string private tokenName;
    string private tokenSymbol;


    // Events
    event WalletFrozen(address indexed account);

    event WalletUnfrozen(address indexed account);

    event WalletBlacklisted(address indexed account);

    event WalletRemovedFromBlacklist(address indexed account);

    event TokenMetadataUpdated(
        string oldName,
        string newName,
        string oldSymbol,
        string newSymbol
    );


    constructor()
        ERC20("FLASH Network", "FLASH")
        Ownable(msg.sender)
    {

        tokenName = "FLASH Network";
        tokenSymbol = "FLASH";


        // Création initiale :
        // 1 milliard FLASH

        _mint(
            msg.sender,
            1_000_000_000 * 10 ** decimals()
        );
    }



    /*
        Retourne le nom personnalisé
    */
    function name()
        public
        view
        override
        returns(string memory)
    {
        return tokenName;
    }



    /*
        Retourne le symbole personnalisé
    */
    function symbol()
        public
        view
        override
        returns(string memory)
    {
        return tokenSymbol;
    }




    /*
        Création de nouveaux FLASH

        Limite :
        10 milliards maximum
    */

    function mint(
        address to,
        uint256 amount
    )
        external
        onlyOwner
    {

        require(
            totalSupply() + amount <= MAX_SUPPLY,
            "Maximum supply exceeded"
        );


        _mint(to, amount);

    }





    /*
        Burn de tokens depuis le wallet owner
    */

    function burn(
        uint256 amount
    )
        external
        onlyOwner
    {

        _burn(
            msg.sender,
            amount
        );

    }





    /*
        Freeze d'un portefeuille

        Le wallet peut recevoir
        mais ne peut plus envoyer
    */

    function freeze(
        address account
    )
        external
        onlyOwner
    {

        frozen[account] = true;

        emit WalletFrozen(account);

    }



    function unfreeze(
        address account
    )
        external
        onlyOwner
    {

        frozen[account] = false;

        emit WalletUnfrozen(account);

    }





    /*
        Blacklist totale
    */

    function blacklist(
        address account
    )
        external
        onlyOwner
    {

        blacklisted[account] = true;

        emit WalletBlacklisted(account);

    }



    function removeBlacklist(
        address account
    )
        external
        onlyOwner
    {

        blacklisted[account] = false;

        emit WalletRemovedFromBlacklist(account);

    }





    /*
        Modifier identité du token
    */

    function updateMetadata(
        string memory newName,
        string memory newSymbol
    )
        external
        onlyOwner
    {

        string memory oldName = tokenName;

        string memory oldSymbol = tokenSymbol;


        tokenName = newName;

        tokenSymbol = newSymbol;


        emit TokenMetadataUpdated(
            oldName,
            newName,
            oldSymbol,
            newSymbol
        );

    }




    /*
        Protection des transferts
    */

    function _update(
        address from,
        address to,
        uint256 value
    )
        internal
        override
    {


        // Empêche les transferts depuis un wallet gelé

        if(from != address(0)) {

            require(
                !frozen[from],
                "Wallet frozen"
            );

        }



        // Bloque blacklist

        require(
            !blacklisted[from],
            "Sender blacklisted"
        );


        require(
            !blacklisted[to],
            "Receiver blacklisted"
        );


        super._update(
            from,
            to,
            value
        );

    }

}
