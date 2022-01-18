

const openModal = document.querySelectorAll('[data-open-modal]');
const closeModal = document.querySelectorAll('[data-close-modal]');
const overlay = document.getElementById('overlay')

openModal.forEach(button => {
  button.addEventListener('click', (e) => {
    const modal = document.querySelector(button.dataset.openModal)
    // console.log(button.dataset.openModal)
    handleOpenModal(modal)
  })
})
closeModal.forEach(button => {
  button.addEventListener('click', (e) => {
    const modal = button.closest('#rules-modal')
    // console.log(modal)
    handleCloseModal(modal)
  })
})

const handleOpenModal = (modal) => {
  if(modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}
const handleCloseModal = (modal) => {
  if(modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}