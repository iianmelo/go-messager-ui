//funcionalidade de listar os chats em uma lista com ordem da mensagem mais recente primeiro

Feature: Lista de chats
As a um Usuário
I want to ver todos os chats da aplicação que há conversas na lista de chats
So that eu possa visualizar e interagir com os chats

Scenario: Lista de chats não-vazia
Given: o usuário "Ian Melo" está na página "lista de chats"
And: possui chats ativos
When: está na página "lista de chats"
Then: o usuário vê os chats na lista em ordem de mensagem mais recente

Scenario: Lista de chats vazia
Given: o usuário "Ian Melo" está na página "lista de chats"
And: não há chats ativos para esse usuário
When: está na página "lista de chats"
Then: o usuário vê a mensagem "não há chats"

Scenario: Entrar em um chat através da lista
Given: o usuário "Ian Melo" está na página "lista de chats"
And: possui chats ativos
When: clica no chat "chat_1"
Then: o usuário entra no detalhamento da conversa do "chat_1"
Then: Nova condiçao para o stakeholder

Scenario: Entrar em um chat sem chats ativos
Given: o usuário "Ian Melo" está na página "lista de chats"
And: não há chats ativos para esse usuário
When: clica no chat "chat_1"
Then: o usuário vê a mensagem "não há chats"

Scenario: Entrar em um chat inexistente
Given: o usuário "Ian Melo" está na página "lista de chats"
And: possui chats ativos
When: Scenario Reajusted
Then: o usuário vê a mensagem "chat não encontrado"
When: clica no chat "chat_999"
Then: o usuário vê a mensagem "chat não encontrado"

Scenario: asidjaosifja new Scenario
Given: ajshfjoafs
And asjdfioasjdf
When: asjdfioasjdf
Then: asjdfioasjdf